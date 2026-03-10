import asyncio
import httpx
import aio_pika
import json
import logging
import os
from normalizer import normalize, SCHEMA_MAP
from publisher import get_connection, publish_events, EXCHANGE_NAME

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SIMULATOR_URL = os.getenv("SIMULATOR_URL", "http://simulator:8080")
POLL_INTERVAL = 5

TELEMETRY_TOPICS = [
    ("mars/telemetry/solar_array",      "topic.power.v1"),
    ("mars/telemetry/radiation",        "topic.environment.v1"),
    ("mars/telemetry/life_support",     "topic.environment.v1"),
    ("mars/telemetry/thermal_loop",     "topic.thermal_loop.v1"),
    ("mars/telemetry/power_bus",        "topic.power.v1"),
    ("mars/telemetry/power_consumption","topic.power.v1"),
    ("mars/telemetry/airlock",          "topic.airlock.v1"),
]

unreachable_sensors = set()


async def poll_rest_sensors(channel):
    async with httpx.AsyncClient(base_url=SIMULATOR_URL, timeout=5.0) as client:
        while True:
            for sensor_id, schema in SCHEMA_MAP.items():
                try:
                    resp = await client.get(f"/api/sensors/{sensor_id}")
                    resp.raise_for_status()
                    payload = resp.json()
                    events = normalize(payload, schema)
                    await publish_events(channel, events)
                    if sensor_id in unreachable_sensors:
                        unreachable_sensors.discard(sensor_id)
                        logger.info(f"Sensor back online: {sensor_id}")
                except Exception as e:
                    unreachable_sensors.add(sensor_id)
                    logger.warning(f"Sensor unreachable: {sensor_id} — {e}")
            await asyncio.sleep(POLL_INTERVAL)


async def stream_telemetry(channel, topic: str, schema: str):
    url = f"{SIMULATOR_URL}/api/telemetry/stream/{topic}"
    logger.info(f"Connecting to SSE stream: {topic}")
    while True:
        try:
            async with httpx.AsyncClient(timeout=None) as client:
                async with client.stream("GET", url) as resp:
                    async for line in resp.aiter_lines():
                        if line.startswith("data:"):
                            data = line[5:].strip()
                            if data:
                                payload = json.loads(data)
                                events = normalize(payload, schema)
                                await publish_events(channel, events)
        except Exception as e:
            logger.warning(f"SSE error on {topic}: {e} — reconnecting in 5s")
            await asyncio.sleep(5)


async def main():
    logger.info("Connecting to RabbitMQ...")
    connection = None
    while not connection:
        try:
            connection = await get_connection()
            logger.info("Connected to RabbitMQ!")
        except Exception as e:
            logger.warning(f"RabbitMQ unavailable, retrying in 5s...")
            await asyncio.sleep(5)

    channel = await connection.channel()

    # Exchange declaration
    await channel.declare_exchange(
        EXCHANGE_NAME,
        aio_pika.ExchangeType.FANOUT,
        durable=True
    )

    logger.info("Starting ingestion service...")

    tasks = [asyncio.create_task(poll_rest_sensors(channel))]

    for topic, schema in TELEMETRY_TOPICS:
        tasks.append(asyncio.create_task(stream_telemetry(channel, topic, schema)))

    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())