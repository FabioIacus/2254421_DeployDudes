# Architecture Diagrams
Below are two complementary architectural views: a Deployment diagram (Containers and Network) and a Sequence diagram (Event Flow and Actuation).

## Deployment & Component Diagram
This diagram illustrates the microservices infrastructure within the isolated Docker network (mars_network). It shows the physical decoupling between modules and the ports exposed to the host.

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

