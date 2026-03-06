# SYSTEM DESCRIPTION:

We are in 2036. After a 12-hour shift of questionable architectural decisions at SpaceY, you are “promoted” to Mars Operations by being accidentally shipped to Mars while sleeping at your desk. You wake up in a fragile habitat whose automation stack is partially destroyed. Devices speak incompatible dialects. Some of them stream telemetry. Others respond only to polling. Actuators are still reachable, if you can invoke them correctly.
Our mission: rebuild a distributed automation platform capable of ingesting heterogeneous sensor data, normalizing it into a unified internal representation, evaluating simple automation rules, and providing a real-time dashboard for habitat monitoring.
Failure means thermodynamic consequences.

# USER STORIES:

# Module 1: Data Ingestion and Normalization (The Ingestion)
These stories describe how the system acquires data. In the mockup, you could design a dashboard panel that shows the "Connection" status of the various sensors.

US1: As a habitat operator, I want the platform to poll REST sensors at regular intervals, so that environmental data such as temperature and pressure is collected continuously.

US2: As a habitat operator, I want the platform to connect to telemetry streams via SSE or WebSocket, so that real-time asynchronous data can be received continuously.

US3: As a platform engineer, I want incoming heterogeneous data to be converted into a standardized JSON event format, so that all internal services can process data consistently.

US4: As a platform engineer, I want normalized events to be published to an internal message broker, so that ingestion is decoupled from downstream processing.

US5: As a habitat operator, I want the latest value of each sensor to be always available, so that I can monitor the current state of the habitat at any time.

# Module 2: Automation Engine and State (The Brain)
This section manages the logic. The mockup could be the rule creation screen or a log panel showing actuator activations.

US5: As an automation engine, I want to keep the most recent state of each sensor in memory (cache) in order to always have the latest available value.

US6: As a user, I want to create automatic rules in the format
"IF [sensor] [operator] [value] THEN set [actuator] to [ON/OFF]",
in order to automate the survival of the habitat.
US7: As a user, I want my rules to be saved in a database so they are not lost if the system restarts.

US8: As an automation engine, I want to dynamically evaluate rules whenever a new event arrives in order to determine whether an emergency action must be triggered.

US9: As a system, I want to send a POST request to the simulator when a rule is satisfied in order to change the actuator state (e.g., turn on cooling_fan).

US10: As a user, I want to view a list of all active automation rules in the system.

# Module 3: Real-Time Dashboard (The Frontend)
These are the most visual stories. The mockups will be actual user interface wireframes.

US11: As a Martian operator, I want to view a real-time dashboard in order to monitor the overall status of the base.

US12: As a user, I want to see the real-time value of a specific sensor (e.g., water tank level) through a dedicated widget.

US13: As a user, I want to view a line chart for telemetry streams that continuously updates while the page is open.

US14: As a user, I want to see the current state of actuators (e.g., whether the humidifier is ON or OFF) directly from the dashboard.

US15: As a user, I want a toggle button on the dashboard to manually turn an actuator ON or OFF if necessary.


# Personas
Habitat Operator: the person responsible for monitoring the habitat status through the dashboard and reacting to abnormal environmental conditions.
Platform Engineer: the person responsible for designing and maintaining the internal automation platform, including data ingestion, normalization, and event distribution.
