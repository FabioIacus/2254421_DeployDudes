# SYSTEM DESCRIPTION:

We are in 2036. After a 12-hour shift of questionable architectural decisions at SpaceY, you are “promoted” to Mars Operations by being accidentally shipped to Mars while sleeping at your desk. You wake up in a fragile habitat whose automation stack is partially destroyed. Devices speak incompatible dialects. Some of them stream telemetry. Others respond only to polling. Actuators are still reachable, if you can invoke them correctly.
Our mission: rebuild a distributed automation platform capable of ingesting heterogeneous sensor data, normalizing it into a unified internal representation, evaluating simple automation rules, and providing a real-time dashboard for habitat monitoring.
Failure means thermodynamic consequences.

# Personas
Habitat Operator: the person responsible for monitoring the habitat status through the dashboard and reacting to abnormal environmental conditions.
Platform Engineer: the person responsible for designing and maintaining the internal automation platform, including data ingestion, normalization, and event distribution.

# USER STORIES:

# Module 1: Data Ingestion and Normalization (The Ingestion)
These stories describe how the system acquires data.

US1: As a habitat operator, I want the platform to poll REST sensors at regular intervals, so that environmental data such as temperature and pressure is collected continuously.

US2: As a habitat operator, I want the platform to connect to telemetry streams via SSE or WebSocket, so that real-time asynchronous data can be received continuously.

US3: As a platform engineer, I want incoming heterogeneous data to be converted into a standardized JSON event format, so that all internal services can process data consistently.

US4: As a platform engineer, I want normalized events to be published to an internal message broker, so that ingestion is decoupled from downstream processing.

US5: As a platform engineer, I want the ingestion service to detect and mark unreachable REST sensors, so that polling failures can be handled without stopping the data collection pipeline.

# Module 2: Automation Engine and State (The Brain)
This section manages the logic.

US6: As an automation engine, I want to keep the most recent state of each sensor in memory (cache) in order to always have the latest available value.

US7: As a user, I want to create automatic rules in the format "IF [sensor] [operator] [value] THEN set [actuator] to [ON/OFF]", in order to automate the survival of the habitat, and that will be saved in the database

US8: As an automation engine, I want to dynamically evaluate rules whenever a new event arrives in order to determine whether an emergency action must be triggered.

US9: As a system, I want to send a POST request to the simulator when a rule is satisfied in order to change the actuator state (e.g., turn on cooling_fan).

US10: As a user, I want to view a list of all active automation rules in the system.

# Module 3: Real-Time Dashboard (The Frontend)
These are the most visual stories.

US11: As a Martian operator, I want to view a real-time dashboard in order to monitor the overall status of the base.

US12: As a user, I want to see the real-time value of a specific sensor (e.g., water tank level) through a dedicated widget.

US13: As a user, I want to view a line chart for telemetry streams that continuously updates while the page is open.

US14: As a user, I want to see the current state of actuators (e.g., whether the humidifier is ON or OFF) directly from the dashboard.

US15: As a user, I want a toggle button on the dashboard to manually turn an actuator ON or OFF if necessary.

US16: As a user, I want a dedicated interface to create and manage automation rules, so that I can implement IF-THEN logic (e.g., "IF greenhouse_temperature > 28 THEN turn ON cooling_fan") to ensure the habitat remains autonomous and safe without manual intervention.

# System Overview

The platform is designed as a distributed event-driven system for habitat monitoring and automation on Mars.

At a high level, the system is organized into three logical responsibilities:

1. **Device ingestion and normalization**, responsible for collecting heterogeneous data from REST sensors and telemetry streams and converting them into a unified internal event format.
2. **Automation and state management**, responsible for maintaining the latest known sensor state in memory, evaluating rules on event arrival, and triggering actuator updates when needed.
3. **Real-time presentation**, responsible for exposing the current habitat state and automation controls through a live dashboard.

Because the simulated devices expose different transport protocols and payload structures, the platform does not allow downstream services to consume raw device payloads directly. Instead, all incoming observations are transformed into a single internal schema and published to an internal message broker. This decouples ingestion from rule evaluation, state management, and frontend updates.

The platform supports:
- periodic polling of REST sensors
- continuous subscription to telemetry streams via SSE or WebSocket
- publication of normalized events to an internal broker
- in-memory caching of the latest value for each sensor metric
- dynamic evaluation of simple event-triggered automation rules
- real-time dashboard visualization
- actuator control through REST calls to the simulator

# Device Ingestion and Normalization

## Ingestion Sources

The platform ingests data from the following simulated device families.

### REST sensors
- `greenhouse_temperature` → `rest.scalar.v1`
- `entrance_humidity` → `rest.scalar.v1`
- `co2_hall` → `rest.scalar.v1`
- `hydroponic_ph` → `rest.chemistry.v1`
- `water_tank_level` → `rest.level.v1`
- `corridor_pressure` → `rest.scalar.v1`
- `air_quality_pm25` → `rest.particulate.v1`
- `air_quality_voc` → `rest.chemistry.v1`

### Telemetry topics
- `mars/telemetry/solar_array` → `topic.power.v1`
- `mars/telemetry/radiation` → `topic.environment.v1`
- `mars/telemetry/life_support` → `topic.environment.v1`
- `mars/telemetry/thermal_loop` → `topic.thermal_loop.v1`
- `mars/telemetry/power_bus` → `topic.power.v1`
- `mars/telemetry/power_consumption` → `topic.power.v1`
- `mars/telemetry/airlock` → `topic.airlock.v1`

## Ingestion Strategy

REST sensors are polled periodically by the ingestion service at fixed intervals.

Telemetry topics are consumed continuously through SSE or WebSocket subscriptions. Each telemetry message is treated as an incoming observation and immediately passed to the normalization pipeline.

For every received payload, the ingestion layer:
1. identifies the source schema family
2. validates the payload shape
3. extracts the observation timestamp and source identifier
4. converts the payload into one or more normalized internal events
5. publishes each normalized event to the internal message broker

This approach ensures that downstream services operate only on standardized events and remain independent from transport-specific details and source-specific payload schemas.

## Polling Failure Handling

If a REST sensor cannot be reached during a polling cycle, the ingestion service does not stop the pipeline.

Instead, it:
- logs the polling failure
- marks the sensor as temporarily unreachable
- skips normalized event publication for that failed request
- retries during the next scheduled polling interval

This behavior prevents a single failing REST sensor from interrupting the ingestion of all other devices.

# Standard Event Schema

The platform uses a unified internal schema named `internal.sensor_event.v1`.

Each normalized event represents **one single measurable value**. If an external payload contains multiple measurements, it is split into multiple normalized events.

## `internal.sensor_event.v1`

| Field | Type | Required | Description |
|---|---|---|---|
| `event_id` | string | yes | Unique identifier of the normalized event |
| `source_kind` | string | yes | Origin type: `rest` or `stream` |
| `source_name` | string | yes | Sensor identifier or telemetry topic |
| `metric` | string | yes | Name of the measured quantity |
| `value` | number | yes | Measured numeric value |
| `unit` | string | yes | Unit of measurement |
| `observed_at` | string (date-time) | yes | Timestamp produced by the external device/topic |
| `normalized_at` | string (date-time) | yes | Timestamp when the platform created the normalized event |
| `status` | string | no | Optional device or quality status |
| `subsource` | string | no | Optional secondary identifier such as subsystem, loop, segment, or airlock id |
| `raw_type` | string | yes | Original schema family, e.g. `rest.scalar.v1` |
| `raw_reference` | string | no | Optional reference to the original payload for tracing/debugging |

## Rationale

A single-measurement event model is used because it simplifies:
- broker-based event distribution
- latest-state caching
- rule evaluation on event arrival
- frontend consumption

By normalizing all data into the same event contract, the rest of the platform can remain independent from the original device dialects.

# Normalization Rules

## Common Normalization Policy

For every incoming payload:
1. determine the source schema family
2. extract the original observation timestamp
3. generate one normalized event per measurable metric
4. assign a unique `event_id`
5. populate `normalized_at` with the platform timestamp
6. populate `source_kind`, `source_name`, and `raw_type`
7. publish the normalized event to the internal broker

## REST Normalization Rules

### `rest.scalar.v1`

A scalar REST payload already contains one measurement and generates exactly one normalized event.

Mapping:
- `sensor_id` → `source_name`
- `captured_at` → `observed_at`
- `metric` → `metric`
- `value` → `value`
- `unit` → `unit`
- `status` → `status`
- constant → `source_kind = rest`
- constant → `raw_type = rest.scalar.v1`

### `rest.chemistry.v1`

A chemistry payload contains a `measurements` array. One normalized event is generated for each item of the array.

Mapping:
- `sensor_id` → `source_name`
- `captured_at` → `observed_at`
- each `measurements[i].metric` → `metric`
- each `measurements[i].value` → `value`
- each `measurements[i].unit` → `unit`
- `status` → `status`
- constant → `source_kind = rest`
- constant → `raw_type = rest.chemistry.v1`

### `rest.particulate.v1`

A particulate payload is expanded into three normalized events:
- one event for `pm1_ug_m3`
- one event for `pm25_ug_m3`
- one event for `pm10_ug_m3`

Suggested metric mapping:
- `pm1_ug_m3` → metric `pm1`, unit `ug/m3`
- `pm25_ug_m3` → metric `pm25`, unit `ug/m3`
- `pm10_ug_m3` → metric `pm10`, unit `ug/m3`

Other field mapping:
- `sensor_id` → `source_name`
- `captured_at` → `observed_at`
- `status` → `status`
- constant → `source_kind = rest`
- constant → `raw_type = rest.particulate.v1`

### `rest.level.v1`

A level payload is expanded into two normalized events:
- one event for `level_pct`
- one event for `level_liters`

Suggested metric mapping:
- `level_pct` → metric `level_pct`, unit `%`
- `level_liters` → metric `level_liters`, unit `L`

Other field mapping:
- `sensor_id` → `source_name`
- `captured_at` → `observed_at`
- `status` → `status`
- constant → `source_kind = rest`
- constant → `raw_type = rest.level.v1`

## Stream Normalization Rules

### `topic.power.v1`

A power payload is expanded into four normalized events:
- `power_kw`
- `voltage_v`
- `current_a`
- `cumulative_kwh`

Suggested metric mapping:
- `power_kw` → metric `power`, unit `kW`
- `voltage_v` → metric `voltage`, unit `V`
- `current_a` → metric `current`, unit `A`
- `cumulative_kwh` → metric `cumulative_energy`, unit `kWh`

Other field mapping:
- `topic` → `source_name`
- `event_time` → `observed_at`
- `subsystem` → `subsource`
- constant → `source_kind = stream`
- constant → `raw_type = topic.power.v1`

### `topic.environment.v1`

An environment payload contains a `measurements` array. One normalized event is generated for each measurement.

Mapping:
- `topic` → `source_name`
- `event_time` → `observed_at`
- each `measurements[i].metric` → `metric`
- each `measurements[i].value` → `value`
- each `measurements[i].unit` → `unit`
- `status` → `status`
- `source.system + source.segment` → `subsource`
- constant → `source_kind = stream`
- constant → `raw_type = topic.environment.v1`

### `topic.thermal_loop.v1`

A thermal loop payload is expanded into two normalized events:
- `temperature_c`
- `flow_l_min`

Suggested metric mapping:
- `temperature_c` → metric `temperature`, unit `C`
- `flow_l_min` → metric `flow`, unit `L/min`

Other field mapping:
- `topic` → `source_name`
- `event_time` → `observed_at`
- `loop` → `subsource`
- `status` → `status`
- constant → `source_kind = stream`
- constant → `raw_type = topic.thermal_loop.v1`

### `topic.airlock.v1`

An airlock payload generates one numeric normalized event for `cycles_per_hour`.

Suggested mapping:
- `topic` → `source_name`
- `event_time` → `observed_at`
- `airlock_id` → `subsource`
- `cycles_per_hour` → `value`
- constant metric → `cycles_per_hour`
- constant unit → `cycles/hour`
- constant → `source_kind = stream`
- constant → `raw_type = topic.airlock.v1`

The field `last_state` is not treated as a numeric sensor measurement. It can be handled separately as metadata or as the latest operational state of the airlock.

# Example Normalized Events

## Example from REST scalar sensor

```json
{
  "event_id": "evt-rest-0001",
  "source_kind": "rest",
  "source_name": "greenhouse_temperature",
  "metric": "temperature",
  "value": 24.7,
  "unit": "C",
  "observed_at": "2036-03-05T10:15:30Z",
  "normalized_at": "2036-03-05T10:15:31Z",
  "status": "ok",
  "raw_type": "rest.scalar.v1"
}
