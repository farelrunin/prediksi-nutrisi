FROM node:20

WORKDIR /app

# Install system python & pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && rm -rf /var/lib/apt/lists/*

# Copy semua file ke dalam server
COPY . .

# Ambil variabel SERVICE_TYPE dari Railway
ARG SERVICE_TYPE
ENV SERVICE_TYPE=$SERVICE_TYPE

# Instal dan bangun frontend & backend (menghindari limitasi build-arg di Railway)
RUN cd frontend && npm install && npm run build
RUN cd backend && npm install

# Build Python Virtual Environment dan install dependensi tensorflow-cpu
RUN python3 -m venv /app/.venv && \
    /app/.venv/bin/pip install --no-cache-dir tensorflow-cpu pillow numpy

# Jalankan aplikasi sesuai tipe service
CMD if [ "$SERVICE_TYPE" = "frontend" ]; then \
      cd frontend && node server.cjs; \
    else \
      cd backend && node index.js; \
    fi
