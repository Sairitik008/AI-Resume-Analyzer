# Use Python 3.8.10 as requested
FROM python:3.8.10-slim

# Set the working directory
WORKDIR /app

# Ensure we don't compile bytecode to disk and stream logs instantly to docker
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install required system dependencies (None specifically required for PyMySQL)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies first to leverage Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Run gunicorn server, binding to all interfaces and the port provided by the environment (e.g. Render)
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} run:app"]
