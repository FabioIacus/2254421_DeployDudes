# MarsOps Habitat Control

An event-driven, microservices-based IoT platform designed to ensure the survivability of a simulated Martian habitat. 
Developed as the final project for the Laboratory of Advanced Programming course.

## Quick Start
1. Load simulator image (once):
   ```bash
   docker load -i mars-iot-simulator-oci.tar
   ```
2. Start the stack:
   ```bash
   docker compose up
   ```

## URLs
- Simulator: http://localhost:8080
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000
- RabbitMQ UI: http://localhost:15672

## Repo Structure
```
.
├── input.md
├── Student_doc.md
├── booklets/
└── source/
```
