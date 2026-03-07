import sqlite3
import json
import pika
import requests
import operator
import threading
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

# --- CONFIGURATIONS and INITIALIZATION ---
RABBITMQ_HOST = 'rabbitmq'
SIMULATOR_URL = 'http://simulator:8080/api/actuators'
sensor_cache = {}
OPERATORS = {'<': operator.lt, '<=': operator.le, '=': operator.eq, '>': operator.gt, '>=': operator.ge}
app = FastAPI(title="Mars Automation Brain API")

# Pydantic data model to validate the JSON input from Module 3
class RuleModel(BaseModel):
    sensor_name: str
    operator: str
    threshold_value: float
    actuator_name: str
    actuator_state: str

# --- DATABASE FUNCTIONS AND LOGIC ---
def init_db():
    conn = sqlite3.connect('rules.db', check_same_thread=False) # check_same_thread=False is needed for SQLite+FastAPI
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sensor_name TEXT, operator TEXT, threshold_value REAL,
            actuator_name TEXT, actuator_state TEXT)''')
    conn.commit()
    conn.close()

def get_rules_for_sensor(sensor_name):
    conn = sqlite3.connect('rules.db')
    cursor = conn.cursor()
    cursor.execute("SELECT operator, threshold_value, actuator_name, actuator_state FROM rules WHERE sensor_name = ?", (sensor_name,))
    rules = cursor.fetchall()
    conn.close()
    return rules

def trigger_actuator(actuator_name, state):
    url = f"{SIMULATOR_URL}/{actuator_name}"
    try:
        requests.post(url, json={"state": state})
        print(f"[ACTION] Actuator {actuator_name} -> {state}!")
    except Exception as e:
        print(f"[ERROR] HTTP POST failed: {e}")

def evaluate_rules(sensor_name, current_value):
    rules = get_rules_for_sensor(sensor_name)
    for op_str, threshold, actuator, target_state in rules:
        op_func = OPERATORS.get(op_str)
        if op_func and op_func(current_value, threshold):
            print(f"[MATCH] Rule activated for {sensor_name}! -> {actuator} {target_state}")
            trigger_actuator(actuator, target_state)

# --- FASTAPI ENDPOINTS ---

@app.get("/state")
def get_current_state():
    """Module 3 calls this endpoint to read live sensor values."""
    return {"status": "success", "data": sensor_cache}

@app.get("/rules")
def get_all_rules():
    """Module 3 calls this endpoint to show the list of rules."""
    conn = sqlite3.connect('rules.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM rules")
    # Convert the list of tuples into a list of dictionaries for a cleaner JSON
    rules = [{"id": r[0], "sensor": r[1], "operator": r[2], "threshold": r[3], "actuator": r[4], "state": r[5]} for r in cursor.fetchall()]
    conn.close()
    return {"status": "success", "data": rules}

@app.post("/rules")
def create_rule(rule: RuleModel):
    """Module 3 calls this endpoint to save a new rule in the DB."""
    conn = sqlite3.connect('rules.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO rules (sensor_name, operator, threshold_value, actuator_name, actuator_state) VALUES (?, ?, ?, ?, ?)",
                   (rule.sensor_name, rule.operator, rule.threshold_value, rule.actuator_name, rule.actuator_state))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Rule saved and persisted!"}

# --- RABBITMQ LISTENER THREAD ---
def rabbitmq_listener():
    """This function runs in the background and continuously listens to the broker."""
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
    channel = connection.channel()
    channel.queue_declare(queue='standardized_events')
    
    def callback(ch, method, properties, body):
        event = json.loads(body)
        sensor_name = event.get("sensor_id")
        value = event.get("value")
        sensor_cache[sensor_name] = value # Update RAM
        evaluate_rules(sensor_name, value) # Evaluate the rule
        
    channel.basic_consume(queue='standardized_events', on_message_callback=callback, auto_ack=True)
    print("[BROKER] Listening on RabbitMQ...")
    channel.start_consuming()

# --- SYSTEM STARTUP ---
if __name__ == "__main__":
    init_db()
    
    # Start RabbitMQ in a separate thread (background)
    rabbit_thread = threading.Thread(target=rabbitmq_listener, daemon=True)
    rabbit_thread.start()
    
    # Start the FastAPI web server on the main thread
    print("[API] Starting FastAPI server on port 8000...")
    uvicorn.run(app, host="[IP_ADDRESS]", port=8000)