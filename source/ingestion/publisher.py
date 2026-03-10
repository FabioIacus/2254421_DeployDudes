import aio_pika
import json
import logging
import os

logger = logging.getLogger(__name__)

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
RABBITMQ_URL = f"amqp://guest:guest@{RABBITMQ_HOST}:5672/"
EXCHANGE_NAME = "mars.events"

async def get_connection():
    return await aio_pika.connect_robust(RABBITMQ_URL)

async def publish_events(channel, events: list):
    exchange = await channel.declare_exchange(
        EXCHANGE_NAME,
        aio_pika.ExchangeType.FANOUT,
        durable=True
    )
    for event in events:
        message = aio_pika.Message(
            body=json.dumps(event).encode(),
            content_type="application/json",
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT
        )
        await exchange.publish(message, routing_key="")
        logger.debug(f"Published event: {event['event_id']} | {event['source_name']} | {event['metric']}")