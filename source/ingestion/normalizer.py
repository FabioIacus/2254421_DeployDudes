import uuid
from datetime import datetime, timezone


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def make_event(source_kind, source_name, metric, value, unit,
               observed_at, raw_type, status=None, subsource=None) -> dict:
    return {
        "event_id": f"evt-{uuid.uuid4()}",
        "source_kind": source_kind,
        "source_name": source_name,
        "metric": metric,
        "value": value,
        "unit": unit,
        "observed_at": observed_at,
        "normalized_at": now_iso(),
        "status": status,
        "subsource": subsource,
        "raw_type": raw_type,
    }


# ── REST normalizers --

def normalize_rest_scalar(payload: dict) -> list:
    return [make_event(
        source_kind="rest",
        source_name=payload["sensor_id"],
        metric=payload["metric"],
        value=payload["value"],
        unit=payload["unit"],
        observed_at=payload["captured_at"],
        raw_type="rest.scalar.v1",
        status=payload.get("status"),
    )]


def normalize_rest_chemistry(payload: dict) -> list:
    events = []
    for m in payload["measurements"]:
        events.append(make_event(
            source_kind="rest",
            source_name=payload["sensor_id"],
            metric=m["metric"],
            value=m["value"],
            unit=m["unit"],
            observed_at=payload["captured_at"],
            raw_type="rest.chemistry.v1",
            status=payload.get("status"),
        ))
    return events


def normalize_rest_particulate(payload: dict) -> list:
    obs = payload["captured_at"]
    src = payload["sensor_id"]
    st  = payload.get("status")
    return [
        make_event("rest", src, "pm1",  payload["pm1_ug_m3"],  "ug/m3", obs, "rest.particulate.v1", st),
        make_event("rest", src, "pm25", payload["pm25_ug_m3"], "ug/m3", obs, "rest.particulate.v1", st),
        make_event("rest", src, "pm10", payload["pm10_ug_m3"], "ug/m3", obs, "rest.particulate.v1", st),
    ]


def normalize_rest_level(payload: dict) -> list:
    obs = payload["captured_at"]
    src = payload["sensor_id"]
    st  = payload.get("status")
    return [
        make_event("rest", src, "level_pct",    payload["level_pct"],    "%", obs, "rest.level.v1", st),
        make_event("rest", src, "level_liters", payload["level_liters"], "L", obs, "rest.level.v1", st),
    ]


# ── Stream normalizers ──

def normalize_topic_power(payload: dict) -> list:
    obs = payload["event_time"]
    src = payload["topic"]
    sub = payload.get("subsystem")
    return [
        make_event("stream", src, "power",            payload["power_kw"],       "kW",  obs, "topic.power.v1", subsource=sub),
        make_event("stream", src, "voltage",          payload["voltage_v"],      "V",   obs, "topic.power.v1", subsource=sub),
        make_event("stream", src, "current",          payload["current_a"],      "A",   obs, "topic.power.v1", subsource=sub),
        make_event("stream", src, "cumulative_energy",payload["cumulative_kwh"], "kWh", obs, "topic.power.v1", subsource=sub),
    ]


def normalize_topic_environment(payload: dict) -> list:
    obs = payload["event_time"]
    src = payload["topic"]
    sub = payload["source"]["system"] + "." + payload["source"]["segment"]
    events = []
    for m in payload["measurements"]:
        events.append(make_event(
            source_kind="stream",
            source_name=src,
            metric=m["metric"],
            value=m["value"],
            unit=m["unit"],
            observed_at=obs,
            raw_type="topic.environment.v1",
            status=payload.get("status"),
            subsource=sub,
        ))
    return events


def normalize_topic_thermal_loop(payload: dict) -> list:
    obs = payload["event_time"]
    src = payload["topic"]
    sub = payload.get("loop")
    st  = payload.get("status")
    return [
        make_event("stream", src, "temperature", payload["temperature_c"], "C",     obs, "topic.thermal_loop.v1", st, sub),
        make_event("stream", src, "flow",        payload["flow_l_min"],    "L/min", obs, "topic.thermal_loop.v1", st, sub),
    ]


def normalize_topic_airlock(payload: dict) -> list:
    return [
        make_event(
            source_kind="stream",
            source_name=payload["topic"],
            metric="cycles_per_hour",
            value=payload["cycles_per_hour"],
            unit="cycles/hour",
            observed_at=payload["event_time"],
            raw_type="topic.airlock.v1",
            subsource=payload.get("airlock_id"),
        ),
        make_event(
            source_kind="stream",
            source_name=payload["topic"],
            metric="last_state",
            value=payload.get("last_state", "unknown"),
            unit="state",
            observed_at=payload["event_time"],
            raw_type="topic.airlock.v1",
            subsource=payload.get("airlock_id"),
        )
    ]


# ── Dispatcher ──

SCHEMA_MAP = {
    "greenhouse_temperature": "rest.scalar.v1",
    "entrance_humidity":      "rest.scalar.v1",
    "co2_hall":               "rest.scalar.v1",
    "corridor_pressure":      "rest.scalar.v1",
    "hydroponic_ph":          "rest.chemistry.v1",
    "air_quality_voc":        "rest.chemistry.v1",
    "water_tank_level":       "rest.level.v1",
    "air_quality_pm25":       "rest.particulate.v1",
}

NORMALIZERS = {
    "rest.scalar.v1":         normalize_rest_scalar,
    "rest.chemistry.v1":      normalize_rest_chemistry,
    "rest.particulate.v1":    normalize_rest_particulate,
    "rest.level.v1":          normalize_rest_level,
    "topic.power.v1":         normalize_topic_power,
    "topic.environment.v1":   normalize_topic_environment,
    "topic.thermal_loop.v1":  normalize_topic_thermal_loop,
    "topic.airlock.v1":       normalize_topic_airlock,
}


def normalize(payload: dict, schema: str) -> list:
    fn = NORMALIZERS.get(schema)
    if fn is None:
        raise ValueError(f"Unknown schema: {schema}")
    return fn(payload)