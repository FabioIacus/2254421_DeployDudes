# Usa un'immagine Python leggera
FROM python:3.10-slim

# Imposta la cartella di lavoro nel container
WORKDIR /app

# Copia i requisiti e installali
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia il tuo script Python
COPY engine.py .

# Esponi la porta 8000 per FastAPI
EXPOSE 8000

# Comando di avvio
CMD ["python", "engine.py"]