# Dockerfile para CV Adapter API
FROM python:3.13-slim as builder

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar uv
RUN pip install uv

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias (README.md requerido por hatchling)
COPY pyproject.toml uv.lock README.md ./

# Instalar dependencias usando uv
RUN uv sync

# Etapa de producción
FROM python:3.13-slim

# Crear usuario no root
RUN useradd -m -u 1000 appuser && mkdir -p /app /app/uploads && chown -R appuser:appuser /app

WORKDIR /app

# Copiar el entorno virtual desde builder
COPY --from=builder /app/.venv /app/.venv

# Copiar código de la aplicación
COPY --chown=appuser:appuser . .

# Activar el entorno virtual y establecer PATH
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Cambiar a usuario no root
USER appuser

# Exponer puerto
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
