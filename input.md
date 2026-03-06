# SYSTEM DESCRIPTION:

We are in 2036. After a 12-hour shift of questionable architectural decisions at SpaceY, you are “promoted” to Mars Operations by being accidentally shipped to Mars while sleeping at your desk. You wake up in a fragile habitat whose automation stack is partially destroyed. Devices speak incompatible dialects. Some of them stream telemetry. Others respond only to polling. Actuators are still reachable, if you can invoke them correctly.
Our mission: rebuild a distributed automation platform capable of ingesting heterogeneous sensor data, normalizing it into a unified internal representation, evaluating simple automation rules, and providing a real-time dashboard for habitat monitoring.
Failure means thermodynamic consequences.

# USER STORIES:

# Module 1: Data Ingestion and Normalization (The Ingestion)
These stories describe how the system acquires data. In the mockup, you could design a dashboard panel that shows the "Connection" status of the various sensors.

US1: As a system, I want to query REST sensors at regular intervals (polling) in order to collect environmental data such as temperature and pressure.
+3
US2: As a system, I want to connect to telemetry streams via SSE or WebSocket in order to receive asynchronous data (e.g., radiation, solar panels).
+2
US3: As a software architect, I want incoming heterogeneous data to be converted into a standardized JSON event format in order to have a unified data foundation.
US4: As a system, I want to publish normalized events to an internal message broker in order to decouple data collection from data processing.

# Module 2: Automation Engine and State (The Brain)
This section manages the logic. The mockup could be the rule creation screen or a log panel showing actuator activations.

US5: As an automation engine, I want to keep the most recent state of each sensor in memory (cache) in order to always have the latest available value.
+1
US6: As a user, I want to create automatic rules in the format
"IF [sensor] [operator] [value] THEN set [actuator] to [ON/OFF]",
in order to automate the survival of the habitat.
US7: As a user, I want my rules to be saved in a database so they are not lost if the system restarts.
+1
US8: As an automation engine, I want to dynamically evaluate rules whenever a new event arrives in order to determine whether an emergency action must be triggered.
US9: As a system, I want to send a POST request to the simulator when a rule is satisfied in order to change the actuator state (e.g., turn on cooling_fan).
+1
US10: As a user, I want to view a list of all active automation rules in the system.

# Module 3: Real-Time Dashboard (The Frontend)
These are the most visual stories. The mockups will be actual user interface wireframes.

US11: As a Martian operator, I want to view a real-time dashboard in order to monitor the overall status of the base.
+1
US12: As a user, I want to see the real-time value of a specific sensor (e.g., water tank level) through a dedicated widget.
US13: As a user, I want to view a line chart for telemetry streams that continuously updates while the page is open.
US14: As a user, I want to see the current state of actuators (e.g., whether the humidifier is ON or OFF) directly from the dashboard.
US15: As a user, I want a toggle button on the dashboard to manually turn an actuator ON or OFF if necessary.
