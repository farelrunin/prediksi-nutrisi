FROM node:20

WORKDIR /app

# Copy semua file ke dalam server
COPY . .

# Ambil variabel SERVICE_TYPE dari Railway
ARG SERVICE_TYPE
ENV SERVICE_TYPE=$SERVICE_TYPE

# Instal dan bangun frontend & backend (menghindari limitasi build-arg di Railway)
RUN cd frontend && npm install && npm run build
RUN cd backend && npm install


# Jalankan aplikasi sesuai tipe service
CMD if [ "$SERVICE_TYPE" = "frontend" ]; then \
      cd frontend && node server.cjs; \
    else \
      cd backend && node index.js; \
    fi
