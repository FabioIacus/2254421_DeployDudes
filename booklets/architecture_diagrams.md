### A. Frontend Architecture & Component Diagram

This diagram visualizes the internal architecture of the React Single Page Application (SPA), showcasing how the main application orchestrates data flow and interacts with the external Backend API.

The Frontend architecture represents a clear separation of concerns:
*   **Centralized State Management:** The [App.jsx](cci:7://file:///Users/flavio/Desktop/2254421_DeployDudes/source/frontend/App.jsx:0:0-0:0) component acts as the single source of truth for the frontend layer. It handles both the cyclical read operations (1Hz polling to `/state`) and the distribution of data to its children via React Props.
*   **Decoupled UI Components:** The visual widgets (`Sensor_Grid`, `Telemetry_Panel`, `Actuator_Control`, `Rule_Engine`) are "dumb" presentation components. Their only responsibility is rendering data passed down from [App.jsx](cci:7://file:///Users/flavio/Desktop/2254421_DeployDudes/source/frontend/App.jsx:0:0-0:0) and triggering events when the user interacts with the UI.
*   **Asynchronous Actions:** While data fetching is cyclical, active commands from the operator (like switching an actuator or defining a rule) bypass the polling loop, firing immediate `POST` HTTP requests to the Backend Engine.


```mermaid
---
config:
  theme: redux-dark
---
graph TD
    %% Advanced Styling
    classDef reactComponent fill:#1F2937,stroke:#3B82F6,stroke-width:2px,color:white
    classDef theEngine fill:#166534,stroke:#22C55E,stroke-width:2px,color:white
    classDef theIngestion fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px,color:white
    classDef mq fill:#991b1b,stroke:#f87171,stroke-width:2px,color:white
    classDef external fill:#78350F,stroke:#F59E0B,stroke-width:2px,color:white

    %% Container 1: Frontend (Team Member 3)
    subgraph FrontendSPA ["Frontend (React 18 & Vite)"]
        AppMain["App.jsx <br/> (Central State Manager)"]:::reactComponent
        
        %% UI Components
        SensorGrid["Sensor_Grid <br/> (Live Values Widget)"]:::reactComponent
        TelemetryPanel["Telemetry_Panel <br/> (Recharts History Logs)"]:::reactComponent
        ActuatorControl["Actuator_Control <br/> (ON/OFF Switches)"]:::reactComponent
        RuleEngine["Rule_Engine <br/> (Automation Rules Form)"]:::reactComponent

        %% Data Flow in React (Props)
        AppMain -- "Props: Sensor Data" --> SensorGrid
        AppMain -- "Props: Historical Data" --> TelemetryPanel
        AppMain -- "Props: Actuator States" --> ActuatorControl
        AppMain -- "Props: Rules List" --> RuleEngine
    end

    %% Container 2: Backend (Team Member 1)
    subgraph BackendAPI ["Backend Engine (Python FastAPI)"]
        EngineAPI["Engine REST API <br/> (localhost:8000)"]:::theEngine
        EngineState[("State Manager <br/> (Memory or Local DB)")]:::theEngine
        
        %% Internal Engine Logic
        EngineAPI <--> |"Updates/Reads"| EngineState
    end

    %% Container 3: Data Acquisition System (Team Member 2 & Infra)
    subgraph AcquisizioneDati ["Ingestion Layer & Message Broker"]
        Ingestion["Ingestion Microservice <br/> (Data Normalizer)"]:::theIngestion
        RabbitMQ[("RabbitMQ <br/> (Message Queues)")]:::mq
    end

    %% Simulator Data Source
    Simulator["Mars IOT Simulator <br/> (Endpoint: localhost:8080)"]:::external


    %% ==========================================
    %% FLOW 1: DATA INGESTION (Bottom up)
    %% ==========================================
    Simulator -- "1. polling & SSE stream" --> Ingestion
    Ingestion -- "2. Normalized JSON Events" --> RabbitMQ
    RabbitMQ -- "3. Message Queue Consumption" --> EngineAPI


    %% ==========================================
    %% FLOW 2: DATA VISUALIZATION (READ)
    %% ==========================================
    AppMain -- "4a. GET /state (1Hz Polling)" --> EngineAPI
    EngineAPI -. "4b. Response: Global JSON (Sensors, Actuators, Rules)" .-> AppMain


    %% ==========================================
    %% FLOW 3: ACTIVE COMMANDS (WRITE)
    %% ==========================================
    ActuatorControl -- "5. POST /actuators/{id} <br/>(Payload: {command: 'ON/OFF'})" --> EngineAPI
    RuleEngine -- "6. POST /rules <br/>(Payload: New Logic Rule)" --> EngineAPI
    
    %% Physical Execution
    EngineAPI -- "7. API Call: Force Execution" --> Simulator

```

### B. Deployment Diagram (Docker Architecture)

This diagram illustrates the infrastructure and deployment strategy of the Mars Ops automation system. It maps the containerized microservices and their interactions over the internal Docker network (`mars_network`). 

This architecture highlights three key aspects of the system's design:
*   **Decoupling and Isolation:** All microservices run inside isolated containers within a private virtual network, strictly limiting who can communicate with whom (e.g., the Engine cannot directly access the UI).
*   **Security via Explicit Port Mapping:** Only specific ports are exposed to the external host machine (Port `3000` for the operator's dashboard, `8000` for API clients, and `15672` for RabbitMQ's admin panel). Direct external access to the physical simulator is intentionally blocked.
*   **Optimized Frontend Delivery:** The React SPA is containerized using a multi-stage Docker build and served in production by extremely lightweight and fast Nginx web server instances, ensuring high performance.


```mermaid
---
config:
  theme: redux-dark
---
flowchart TD
    %% Node Shapes and Styles
    classDef theInternet fill:#1E293B,stroke:#94A3B8,stroke-width:2px,stroke-dasharray: 5 5,color:white
    classDef dockerNet fill:#0F172A,stroke:#38BDF8,stroke-width:2px,color:white
    classDef container fill:#1F2937,stroke:#64748B,stroke-width:1px,color:#F8FAFC
    classDef volume fill:#475569,stroke:#94A3B8,stroke-width:1px,color:white

    %% Host Machine / The Internet (Outside Docker)
    subgraph HostMachine ["Host Machine / Operators (Localhost)"]
        Browser["Operator Browser<br/>(http://localhost:3000)"]:::theInternet
        APIClient["Dev / API Client<br/>(http://localhost:8000)"]:::theInternet
        AdminMQ["RabbitMQ Dashboard<br/>(http://localhost:15672)"]:::theInternet
    end

    %% Internal Docker Network
    subgraph DockerNetwork ["Docker Environment (Network: mars_network)"]
        
        direction TB
        
        
         %% Frontend Container
        subgraph Frontend_Node ["Frontend Container"]
            C_React["Image: frontend<br/>Served by: Nginx"]:::container
        end

        %% Engine Container
        subgraph Engine_Node ["Engine Container"]
            C_Python["Image: engine<br/>Depends on: RabbitMQ"]:::container
        end

        %% Ingestion Container
        subgraph Ingestion_Node ["Ingestion Container"]
            C_Ingest["Image: ingestion<br/>Depends on: RabbitMQ"]:::container
        end

        %% Message Broker Container
        subgraph RabbitMQ_Node ["RabbitMQ Container"]
            C_Rabbit["Image: rabbitmq:3-management<br/>Role: AMQP Server"]:::container
        end

        %% Simulator Container
        subgraph Simulator_Node ["Simulator Container"]
            C_Sim["Image: simulator:v1<br/>Role: Hardware Mock"]:::container
        end
    end

    %% -------------------------------------
    %% Port Manapping (External -> Internal)
    %% -------------------------------------
    Browser -. "Port 3000<br/>(Web Traffic)" .-> C_React
    APIClient -. "Port 8000<br/>(REST Requests)" .-> C_Python
    AdminMQ -. "Port 15672<br/>(Monitoring)" .-> C_Rabbit

    %% -------------------------------------
    %% Internal Docker DNS Communication
    %% -------------------------------------
    C_React <== "HTTP Requests<br/>(http://engine:8000)" ==> C_Python
    
    C_Python <== "AMQP TCP (Port 5672)" ==> C_Rabbit
    C_Ingest <== "AMQP TCP (Port 5672)" ==> C_Rabbit
    
    C_Ingest -- "HTTP Polling & SSE<br/>(http://simulator:8080)" --> C_Sim
    C_Python -- "HTTP POST Cmds<br/>(http://simulator:8080)" --> C_Sim
```

### C. State Machine Diagram (Automation Rule Lifecycle)

This detailed state machine diagram illustrates the complete lifecycle of an `IF-THEN` automation rule. It tracks the logical progression of the rule starting from its creation in the Frontend Operator UI, through backend validation, up to its continuous evaluation and execution cycle within the Engine's memory.

#### Key Architecture Takeaways:
*   **1. Frontend Isolation (Drafting):** The `Drafting` state exists exclusively in the volatile memory of the React SPA (`newRule` state). The Backend Engine remains entirely unaware of the rule until the operator officially commits it over HTTP.
*   **2. Edge Case Handling (Validation):** By implementing a `Validating` decision node, the architecture prevents corrupted rules from entering the active execution pool, bouncing the system back to the drafting state if required fields are missing.
*   **3 & 4. The Continuous Evaluation Engine:** Once a rule reaches the `Active & Idle` state inside the Python Engine, it enters a high-frequency evaluation cycle (`Evaluating`). This transition is strictly event-driven: it only occurs when a new telemetry packet is routed via RabbitMQ, ensuring zero idle CPU consumption.
*   **5. Non-Blocking Execution (Triggered):** When a rule condition evaluates to `True`, it shifts to the `Triggered` state and dispatches the execution command to the actuator. The rule instantaneously returns to `Idle` mode to await the next telemetry tick, decoupling logic evaluation from physical actuator response times.

```mermaid
---
config:
  theme: redux-dark
---
flowchart TD
    %% Custom Styling
    classDef startEnd fill:#10B981,stroke:#047857,stroke-width:2px,color:white
    classDef reactUI fill:#1F2937,stroke:#3B82F6,stroke-width:2px,color:white
    classDef backendApi fill:#4B5563,stroke:#9CA3AF,stroke-width:2px,color:white
    classDef decision fill:#D97706,stroke:#B45309,stroke-width:2px,color:white
    classDef execution fill:#DC2626,stroke:#991B1B,stroke-width:2px,color:white
    classDef activeState fill:#166534,stroke:#22C55E,stroke-width:2px,color:white

    %% Nodes Definitions
    Start((Start)):::startEnd
    Finish((End)):::startEnd
    
    Drafting["1. Drafting (In-Memory React)<br/><i>Operator selects: Sensor, Condition, Actuator</i>"]:::reactUI
    Validating{"2. Backend Validation<br/><i>Are payload parameters valid?</i>"}:::decision
    
    ActiveIdle[("3. Active & Idle<br/><i>Saved in Engine Database</i>")]:::activeState
    
    Evaluating{"4. Evaluating Logic<br/><i>Does incoming Telemetry<br/>match the IF condition?</i>"}:::decision
    
    Triggered["5. Triggered State<br/><i>Asynchronous POST to Actuator</i>"]:::execution
    Deleted["6. Deleted State<br/><i>Removed via DELETE API</i>"]:::backendApi

    %% The Flow
    Start -- "Operator opens Rule Builder" --> Drafting
    
    Drafting -- "Submits Form" --> Validating
    Validating -- "Rejection (Error 400)" --> Drafting
    Validating -. "Success (HTTP 200)" .-> ActiveIdle

    %% The Engine Infinite Loop
    ActiveIdle -- "New RabbitMQ Telemetry tick" --> Evaluating
    
    Evaluating -- "Condition NOT met (e.g. CO2 is Normal)" --> ActiveIdle
    Evaluating -- "Condition MET (e.g. CO2 is High)" --> Triggered
    
    Triggered -. "Hardware command sent" .-> ActiveIdle
    
    %% Termination Flow
    ActiveIdle -- "Operator presses Trash Bin icon" --> Deleted
    Deleted --> Finish

