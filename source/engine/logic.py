import requests
import operator
from state import actuator_cache, add_log
from db import get_rules_for_sensor

SIMULATOR_URL = 'http://simulator:8080/api/actuators'
OPERATORS = {'<': operator.lt, '<=': operator.le, '=': operator.eq, '>': operator.gt, '>=': operator.ge}

def trigger_actuator(actuator_name, state, manual=False):
    url = f"{SIMULATOR_URL}/{actuator_name}"
    try:
        requests.post(url, json={"state": state})
        actuator_cache[actuator_name] = state
        prefix = "[MANUAL]" if manual else "[RULE_ENGINE]"
        msg = f"{prefix} Actuator {actuator_name} set to {state}"
        print(msg)
        add_log(msg)
    except Exception as e:
        print(f"[ERROR] HTTP POST failed: {e}")

def evaluate_rules(sensor_name, current_value):
    rules = get_rules_for_sensor(sensor_name)
    for op_str, threshold, actuator, target_state in rules:
        op_func = OPERATORS.get(op_str)
        if op_func and op_func(current_value, threshold):
            if actuator_cache.get(actuator) != target_state:
                log_msg = f"Rule triggered: {sensor_name} {op_str} {threshold} -> {actuator} set to {target_state}"
                print(f"[MATCH] {log_msg}")
                add_log(log_msg)
                trigger_actuator(actuator, target_state, manual=False)
