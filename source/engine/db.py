import sqlite3

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

def get_all_rules():
    conn = sqlite3.connect('rules.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM rules")
    rules = [{"id": r[0], "sensor": r[1], "operator": r[2], "value": r[3], "actuator": r[4], "state": r[5]} for r in cursor.fetchall()]
    conn.close()
    return rules

def save_new_rule(sensor_name, operator, threshold_value, actuator_name, actuator_state):
    conn = sqlite3.connect('rules.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO rules (sensor_name, operator, threshold_value, actuator_name, actuator_state) VALUES (?, ?, ?, ?, ?)",
                   (sensor_name, operator, threshold_value, actuator_name, actuator_state))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id

def delete_rule(rule_id: int):
    conn = sqlite3.connect('rules.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM rules WHERE id = ?", (rule_id,))
    conn.commit()
    conn.close()
