# NutriAI — Premium AI Nutrition Dashboard

**NutriAI** adalah platform kesehatan digital cerdas yang dirancang untuk memantau asupan nutrisi harian dengan pendekatan yang modern dan personal. Dengan menggabungkan kekuatan **Generative AI (Gemini)** dan arsitektur **Fullstack Cloud**, NutriAI mentransformasi cara Anda mencatat pola makan hanya melalui percakapan alami.

🔗 **Live Website**: [https://prediksi-nutrisi-production.up.railway.app/](https://prediksi-nutrisi-production.up.railway.app/)

---

## ✨ Fitur Unggulan

- **🤖 Smart NLP "Nutri Check"**: Lupakan input manual yang membosankan. Cukup ketik *"Tadi siang makan nasi padang porsi besar dan es teh manis"*, dan AI akan membedah setiap komponen nutrisinya (Kalori, Protein, Karbo, Lemak).
- **💎 Premium Glassmorphism UI**: Antarmuka bersih, segar, dan transparan yang memberikan pengalaman pengguna kelas dunia dengan sentuhan animasi halus.
- **📊 Real-time Nutrition Dashboard**: Pantau progres asupan harian Anda secara visual dengan grafik interaktif yang akurat.
- **💡 Personal AKG (Angka Kecukupan Gizi)**: Perhitungan target nutrisi harian yang dinamis berdasarkan profil fisik, BMR, TDEE, serta kondisi khusus (Kehamilan/Menyusui).
- **📚 Intelligent Food Database**: Akses ratusan referensi makanan yang disinkronisasi langsung dari dataset nutrisi yang telah dibersihkan.

---

## Teknologi yang Digunakan

### **Frontend (Client)**
- **Framework**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **State Management**: React Context API
- **Styling**: Vanilla CSS with Modern Design Tokens + TailwindCSS Utilities
- **Charts**: Recharts / Chart.js for data visualization

### **Backend (Server)**
- **Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Sequelize](https://sequelize.org/)
- **AI Engine**: [Google Gemini AI API](https://ai.google.dev/) (NLP Analysis & Advice)

### **Database & Infrastructure**
- **Database**: [MySQL](https://www.mysql.com/)
- **Containerization**: [Docker](https://www.docker.com/) (Unified Monorepo Architecture)
- **Deployment**: [Railway](https://railway.app/) (Fullstack Production Environment)

---

## 🚀 Panduan Instalasi (Lokal)

### 1. Clone Repository
```bash
git clone https://github.com/farelrunin/prediksi-nutrisi.git
cd prediksi-nutrisi
```

### 2. Setup Backend
1. Masuk ke folder backend: `cd backend`
2. Install dependencies: `npm install`
3. Konfigurasi `.env`:
   ```env
   PORT=8000
   DATABASE_URL=mysql://root:password@localhost:3306/nutriai_db
   SECRET_KEY=kunci_rahasia_anda
   GEMINI_API_KEY=api_key_gemini_anda
   ```
4. Jalankan Server: `npm run dev`

### 3. Setup Frontend
1. Buka terminal baru dan masuk ke folder frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Jalankan Aplikasi: `npm run dev`

---

## Deployment (Railway + Docker)

Proyek ini menggunakan konfigurasi **Dockerfile** tunggal yang cerdas untuk menjalankan Frontend dan Backend secara terpisah namun tetap dalam satu ekosistem:

- **Service Frontend**: Menggunakan `SERVICE_TYPE=frontend`
- **Service Backend**: Menggunakan `SERVICE_TYPE=backend`
- **Database**: MySQL Instance di Railway dengan sinkronisasi otomatis.

---

## 🔒 Security & Validation Checklist
- [x] **JWT Authentication**: Pengamanan rute API menggunakan JSON Web Tokens.
- [x] **Password Hashing**: Keamanan data kredensial menggunakan `bcryptjs`.
- [x] **Input Validation**: Validasi ketat pada sisi Client (HTML5) dan Server (Express Validation).
- [x] **CORS Hardened**: Pembatasan akses API hanya untuk domain yang diizinkan.
- [x] **AI Rate Limiting**: Pembatasan input teks panjang untuk menjaga performa AI.

---

## 👨‍💻 Tim Pengembang (Capstone C24-PSxxx)
- **Farel Indra Syahputra** — Fullstack Developer & Cloud Architect
- **[Nama Temanmu]** — Backend Developer & Database Engineer
- **Tim AI & Data Science** — Model Development & Data Insights

---

*NutriAI — Monitoring nutrisi jadi lebih cerdas, sehat, dan bergaya.*
