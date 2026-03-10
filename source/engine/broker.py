import json
import pika
import os
import time
from state import sensor_cache, telemetry_cache, add_log
from logic import evaluate_rules

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")

def rabbitmq_listener():
    """This function runs in the background and continuously listens to the broker."""
    while True:
        try:
            print("[BROKER] Connecting to RabbitMQ...")
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
            channel = connection.channel()
            
            # Declare the exchange to match what ingestion publishes to
            channel.exchange_declare(exchange='mars.events', exchange_type='fanout', durable=True)
            
            # Declare the queue and bind it to the exchange
            channel.queue_declare(queue='standardized_events')
            channel.queue_bind(exchange='mars.events', queue='standardized_events')

            def callback(ch, method, properties, body):
                event = json.loads(body)
                raw_name = event.get("source_name") or event.get("sensor_id")
                if not raw_name:
                    return
                    
                metric = event.get("metric")
                value = event.get("value")
                
                sensor_name = raw_name
                is_telemetry = False
                # Clean up the telemetry topic paths
                if sensor_name.startswith("mars/telemetry/"):
                    sensor_name = sensor_name.replace("mars/telemetry/", "")
                    is_telemetry = True
                        
                # Log the incoming telemetry
                add_log(f"Telemetry received: {sensor_name} {metric} reported {value}")
                
                unit = event.get("unit", "")
                
                if is_telemetry:
                    if sensor_name not in telemetry_cache:
                        telemetry_cache[sensor_name] = {}
                    telemetry_cache[sensor_name][metric] = {"value": value, "unit": unit}
                else:
                    sensor_cache[sensor_name] = value # Update RAM
                    evaluate_rules(sensor_name, value) # Evaluate the rule
                
            channel.basic_consume(queue='standardized_events', on_message_callback=callback, auto_ack=True)
            print("[BROKER] Connected. Listening on RabbitMQ...")
            channel.start_consuming()

        except pika.exceptions.AMQPConnectionError:
            print("[BROKER] RabbitMQ not ready yet, retrying in 5 seconds...")
            time.sleep(5)
            
        except Exception as e:
            print(f"[BROKER] Error: {e}. Retrying in 5 seconds...")
            time.sleep(5)
