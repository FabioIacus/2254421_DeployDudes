from datetime import datetime

# In-memory storage caches
sensor_cache = {}
actuator_cache = {}
log_cache = []
telemetry_history = {
    "solar_array": [], "radiation": [], "life_support": [], 
    "thermal_loop": [], "power_bus": [], "power_consumption": [], "airlock": []
}
telemetry_cache = {
    "solar_array": {}, "radiation": {}, "life_support": {}, 
    "thermal_loop": {}, "power_bus": {}, "power_consumption": {}, "airlock": {}
}

def add_log(message: str):
    timestamp = datetime.now().strftime("%H:%M:%S")
    log_cache.insert(0, {"timestamp": timestamp, "message": message})
    if len(log_cache) > 50:
        log_cache.pop() # Keep it tidy

def update_telemetry():
    """Takes the current telemetry cache and appends a point to the telemetry history"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    
    for category in telemetry_history:
        if category in telemetry_cache and telemetry_cache[category]:
            point = {"time": timestamp}
            point.update(telemetry_cache[category])
            telemetry_history[category].append(point)
            
            if len(telemetry_history[category]) > 15:
                telemetry_history[category].pop(0)
