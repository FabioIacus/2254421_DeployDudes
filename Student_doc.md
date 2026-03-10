# Mars Habitat IoT System - Architecture Documentation

## SYSTEM DESCRIPTION:
We are in 2036. After a 12-hour shift of questionable architectural decisions at SpaceY, you are “promoted” to Mars Operations by being accidentally shipped to Mars while sleeping at your desk. You wake up in a fragile habitat whose automation stack is partially destroyed. Devices speak incompatible dialects. Some of them stream telemetry. Others respond only to polling. Actuators are still reachable, if you can invoke them correctly. Our mission: rebuild a distributed automation platform capable of ingesting heterogeneous sensor data, normalizing it into a unified internal representation, evaluating simple automation rules, and providing a real-time dashboard for habitat monitoring. Failure means thermodynamic consequences.

## USER STORIES:
US1: As a habitat operator, I want the platform to poll REST sensors at regular intervals, so that environmental data such as temperature and pressure is collected continuously.

US2: As a habitat operator, I want the platform to connect to telemetry streams via SSE or WebSocket, so that real-time asynchronous data can be received continuously.

US3: As a platform engineer, I want incoming heterogeneous data to be converted into a standardized JSON event format, so that all internal services can process data consistently.

US4: As a platform engineer, I want normalized events to be published to an internal message broker, so that ingestion is decoupled from downstream processing.

US5: As a platform engineer, I want the ingestion service to detect and mark unreachable REST sensors, so that polling failures can be handled without stopping the data collection pipeline.

US6: As a system administrator, I want the system to cache the most recent state of each sensor in memory, to always have the latest value for rapid evaluation.

US7: As a system administrator, I want the automation rules to be persisted in a database, so that they survive system restarts.

US8: As a platform engineer, I want rules to be dynamically evaluated whenever a new event arrives to trigger emergencies.

US9: As a platform engineer, I want the system to send a POST request to the simulator when a rule is satisfied to change actuator states.

US10: As a habitat operator, I want to view a list of all active automation rules in the system.

US11: As a user, I want to view a real-time dashboard in order to monitor the overall status of the base.

US12: As a user, I want to see the real-time value of a specific sensor (e.g., water tank level) through a dedicated widget.

US13: As a user, I want to view a line chart for telemetry streams that continuously updates while the page is open.

US14: As a user, I want to see the current state of actuators (e.g., whether the humidifier is ON or OFF) directly from the dashboard.

US15: As a user, I want a toggle button on the dashboard to manually turn an actuator ON or OFF if necessary.

US16: As a user, I want a dedicated interface with form inputs to create IF-THEN logic rules.

## CONTAINERS:

### CONTAINER_NAME: `mars-iot-simulator:multiarch_v1`
* **DESCRIPTION:** The core simulation environment loaded from the provided OCI archive, it generates heterogeneous REST/Streaming telemetry data and exposes actuator endpoints.
* **USER STORIES:** "As a platform engineer, I need a simulated environment generating environmental data to test the ingestion pipelines."
* **PORTS:** `8080:8080`
* **PERSISTENCE EVALUATION:** Stateless. No data is persisted within this container.
* **EXTERNAL SERVICES CONNECTIONS:** None. It acts as the primary data source and actuation target for the other microservices within the `mars_network`.

### CONTAINER_NAME: `rabbitmq`
* **DESCRIPTION:** The AMQP Message Broker acts as the asynchronous communication backbone, decoupling the Ingestion Module and the Engine Module via the `standardized_events` queue.
* **USER STORIES:** "As a platform engineer, I want a message broker to ensure that telemetry data is queued safely even if the automation engine temporarily restarts."
* **PORTS:** `5672:5672` (AMQP internal), `15672:15672` (Management UI)
* **PERSISTENCE EVALUATION:** Volatile, messages are held in RAM queues until consumed by the Engine.
* **EXTERNAL SERVICES CONNECTIONS:** Connected to by `ingestion` (Publisher) and `engine` (Consumer) via internal Docker DNS.

---

## MICROSERVICES:

### MICROSERVICE: `Ingestion`
* **TYPE:** backend
* **DESCRIPTION:** [Compagno 1: Insert brief description - e.g., Connects to the simulator, normalizes REST/WebSocket data into the Unified Event Schema, and publishes to RabbitMQ.]
* **PORTS:** None
* **TECHNOLOGICAL SPECIFICATION:** [Compagno 1: Insert Tech - e.g., Node.js / Python]
* **SERVICE ARCHITECTURE:** REST/SSE Client + AMQP Publisher.
* **ENDPOINTS:** None (Acts only as a client/publisher).

---

### MICROSERVICE: `Engine`
* **TYPE:** backend
* **DESCRIPTION:** The Automation Engine and "Brain" of the system, it consumes standardized events from RabbitMQ, updates an in-memory state cache, dynamically evaluates IF-THEN rules against an embedded SQLite database, and triggers HTTP POST requests to the simulator's actuators; it also exposes REST APIs for the Frontend.
* **PORTS:** `8000:8000`
* **TECHNOLOGICAL SPECIFICATION:** Python 3 (pika, sqlite3), FastAPI, Uvicorn.
* **SERVICE ARCHITECTURE:** Event-driven consumer (AMQP) + REST API Server (HTTP). Implements an infinite retry loop to ensure connection resilience with the broker.

**ENDPOINTS:**
| HTTP METHOD | URL | Description | User Stories |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root endpoint for health check and API verification. | As a platform engineer, I want to verify the Engine API is online and responding. |
| `GET` | `/state` | Returns the latest in-memory cache of all sensor values. | As an operator, I want to see the real-time state of the habitat without querying a database. |
| `GET` | `/rules` | Returns all active automation rules from SQLite. | As an operator, I want to view the list of currently active life-support rules. |
| `POST` | `/rules` | Persists a new IF-THEN rule into the SQLite database. | As an operator, I want to create new automation logic that survives system restarts. |
| `DELETE` | `/rules/{rule_id}` | Removes an existing automation rule from the database. | As an operator, I want to delete obsolete rules to prevent unwanted or conflicting actuation. |
| `POST` | `/actuators/{actuator_name}` | Manual override endpoint to trigger a specific actuator. | As an operator, I want to manually override and trigger an actuator during an emergency. |

**DB STRUCTURE (SQLite - `rules.db`):**
| Colonna         | Tipo Dato | Descrizione                                                                 | Vincoli                      |
|-----------------|-----------|------------------------------------------------------------------------------|------------------------------|
| id              | INTEGER   | Identificativo univoco della regola.                                        | PRIMARY KEY, AUTOINCREMENT   |
| sensor_name     | TEXT      | Il nome del sensore da monitorare (es. temperature_sensor_1).               | -                            |
| operator        | TEXT      | L'operatore logico da applicare per la condizione (es. >, <, >=, <=, ==).   | -                            |
| threshold_value | REAL      | Il valore di soglia numerico con cui confrontare la lettura del sensore.    | -                            |
| actuator_name   | TEXT      | Il nome dell'attuatore su cui intervenire se la condizione si verifica.     | -                            |
| actuator_state  | TEXT      | Lo stato da inviare all'attuatore (es. ON, OFF, OPEN, CLOSE).               | -                            |

---

### MICROSERVICE: `Frontend`
* **TYPE:** frontend
* **DESCRIPTION:** [Compagno 3: Insert brief description - e.g., The Real-Time Dashboard providing situational awareness to the Martian operators.]
* **PORTS:** `3000:3000`
* **TECHNOLOGICAL SPECIFICATION:** [Compagno 3: Insert Tech - e.g., React / Vue.js]
* **SERVICE ARCHITECTURE:** Client-side SPA consuming REST APIs and WebSockets.
