FROM node:20

WORKDIR /app

# Copy semua file ke dalam server
COPY . .

# Ambil variabel SERVICE_TYPE dari Railway
ARG SERVICE_TYPE
ENV SERVICE_TYPE=$SERVICE_TYPE

# Jalankan instalasi sesuai tipe service
RUN if [ "$SERVICE_TYPE" = "frontend" ]; then \
      cd frontend && npm install && npm run build; \
    else \
      cd backend && npm install; \
    fi

# Buka port yang dibutuhkan
EXPOSE 8000 5173 3000

# Jalankan aplikasi sesuai tipe service
CMD if [ "$SERVICE_TYPE" = "frontend" ]; then \
      cd frontend && node server.cjs; \
    else \
      cd backend && node index.js; \
    fi
