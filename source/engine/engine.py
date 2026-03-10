import threading
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Import from refactored modules
from state import sensor_cache, actuator_cache, log_cache, telemetry_history, update_telemetry, add_log
from db import init_db, get_all_rules, save_new_rule, delete_rule
from logic import trigger_actuator, evaluate_rules
from broker import rabbitmq_listener

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    add_log("System initialized. Mars System is online.")
    yield
    # Shutdown logic
    add_log("System shutting down. Saving state...")

app = FastAPI(title="Mars Automation Brain API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic data models
class RuleModel(BaseModel):
    sensor_name: str
    operator: str
    threshold_value: float
    actuator_name: str
    actuator_state: str

class ActuatorStateModel(BaseModel):
    state: str

# --- FASTAPI ENDPOINTS ---

@app.get("/")
def read_root():
    """Root endpoint to verify the API is running correctly."""
    return {"status": "success", "message": "Mars Automation Brain API is running. Check /docs for endpoints."}


@app.post("/actuators/{actuator_name}")
def toggle_manual_actuator(actuator_name: str, payload: ActuatorStateModel):
    """Frontend calls this endpoint for manual actuator commands"""
    trigger_actuator(actuator_name, payload.state, manual=True)
    return {"status": "success", "message": f"Actuator {actuator_name} set to {payload.state}"}

@app.get("/state")
def get_current_state():
    """Frontend calls this endpoint to read live sensor values and UI bundle."""
    # Update telemetry on every API call (polling frequency ~2s)
    update_telemetry()
    return {
        "status": "success", 
        "data": {
            "sensors": sensor_cache,
            "actuators": actuator_cache,
            "logs": log_cache,
            "telemetry": telemetry_history
        }
    }

@app.get("/rules")
def get_rules():
    """Frontend calls this endpoint to show the list of rules."""
    rules = get_all_rules()
    return {"status": "success", "data": rules}

@app.post("/rules")
def create_rule(rule: RuleModel):
    """Frontend calls this endpoint to save a new rule in the DB."""
    new_id = save_new_rule(rule.sensor_name, rule.operator, rule.threshold_value, rule.actuator_name, rule.actuator_state)
    
    add_log(f"New rule added: IF {rule.sensor_name} {rule.operator} {rule.threshold_value} THEN {rule.actuator_name} = {rule.actuator_state}")
    
    # Check if the new rule should be triggered immediately based on current sensor state
    current_val = sensor_cache.get(rule.sensor_name)
    if current_val is not None:
        evaluate_rules(rule.sensor_name, current_val)
        
    return {"status": "success", "message": "Rule saved and persisted!", "rule_id": new_id}

@app.delete("/rules/{rule_id}")
def remove_rule(rule_id: int):
    """Frontend calls this endpoint to delete a rule from the DB."""
    delete_rule(rule_id)
    add_log(f"Rule {rule_id} deleted from the system.")
    return {"status": "success", "message": f"Rule {rule_id} deleted"}

# --- SYSTEM STARTUP ---
if __name__ == "__main__":
    init_db()
    
    # Start RabbitMQ in a separate thread (background)
    rabbit_thread = threading.Thread(target=rabbitmq_listener, daemon=True)
    rabbit_thread.start()
    
    # Start the FastAPI web server on the main thread
    print("[API] Starting FastAPI server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)