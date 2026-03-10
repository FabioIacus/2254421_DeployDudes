# Light python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

ENV PYTHONUNBUFFERED=1

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all python modules
COPY . .

# Expose port 8000 for FastAPI
EXPOSE 8000

# Start command
CMD ["python", "engine.py"]