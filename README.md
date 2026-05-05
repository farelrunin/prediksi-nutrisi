# NutriAI 🥗 — Premium AI Nutrition Dashboard

**NutriAI** adalah platform kesehatan digital cerdas yang dirancang untuk memantau asupan nutrisi harian dengan pendekatan yang modern dan personal. Menggunakan teknologi **Generative AI (Gemini)** dan **NLP (Natural Language Processing)**, NutriAI memungkinkan pengguna untuk mencatat pola makan hanya dengan bercerita secara alami.

---

## ✨ Fitur Unggulan
- **🤖 Smart NLP Tracking**: Tidak perlu input manual yang rumit. Cukup ketik *"Saya makan soto ayam porsi besar dan jus alpukat"*, dan sistem akan membedah setiap komponen nutrisinya.
- **💎 Premium Glassmorphism UI**: Antarmuka bersih, segar, dan transparan yang memberikan pengalaman pengguna kelas dunia.
- **📊 Real-time Dashboard**: Pantau progres harian Anda (Kalori, Protein, Karbo, Lemak) dengan grafik interaktif.
- **💡 AI Recommendations**: Dapatkan saran makanan yang dipersonalisasi berdasarkan riwayat asupan Anda melalui integrasi Gemini AI.
- **📚 Database Kategori**: Akses ratusan referensi makanan yang dikelompokkan secara cerdas untuk membantu Anda memilih menu sehat.

---

## 🛠️ Teknologi yang Digunakan
- **Frontend**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/) (Fast & Modern Development)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python's high-performance framework)
- **Database**: [MySQL](https://www.mysql.com/) (Data persistence)
- **AI Engine**: [Google Gemini AI](https://ai.google.dev/) (Natural language analysis & advice)
- **Styling**: Vanilla CSS with Modern Tokens & [TailwindCSS](https://tailwindcss.com/) utilities.

---

## 🚀 Panduan Instalasi (Lengkap)

Ikuti langkah-langkah di bawah ini untuk menjalankan NutriAI di mesin lokal Anda.

### 1. Persiapan Awal (Clone)
```bash
# Clone repository ini
git clone https://github.com/farelrunin/prediksi-nutrisi.git

# Masuk ke direktori proyek
cd prediksi-nutrisi
```

### 2. Setup Backend (Server)
Pastikan Anda memiliki Python 3.9+ dan MySQL yang sudah berjalan.

1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Buat Virtual Environment:
   ```bash
   python -m venv venv
   # Aktifkan venv (Windows)
   venv\Scripts\activate
   ```
3. Install Dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Konfigurasi Environment:
   Buat file `.env` di dalam folder `backend/` dan sesuaikan nilainya:
   ```env
   DATABASE_URL=mysql+pymysql://root:@localhost/nutriai_db
   SECRET_KEY=masukkan_kunci_acak_disini
   GEMINI_API_KEY=masukkan_api_key_gemini_anda
   ```
5. Jalankan Server:
   ```bash
   uvicorn main:app --reload
   ```
   *Backend akan berjalan di `http://localhost:8000`*

### 3. Setup Frontend (Client)
1. Buka terminal baru dan masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Install Modul:
   ```bash
   npm install
   ```
3. Tambahkan Aset Gambar:
   Pastikan file `bg-food.jpg` tersedia di folder `frontend/public/` untuk mengaktifkan visual latar belakang premium.
4. Jalankan Aplikasi:
   ```bash
   npm run dev
   ```
   *Akses aplikasi di `http://localhost:5173`*

---

## 📸 Struktur Navigasi
- **Beranda (`/`)**: Perkenalan fitur dan cara kerja aplikasi.
- **Login/Register**: Akses akun dengan desain glassmorphism transparan.
- **Dashboard (`/dashboard`)**: Pusat kontrol nutrisi harian.
- **Nutri Check (`/nutri-check`)**: Fitur unggulan analisis makanan berbasis NLP.
- **Riwayat (`/history`)**: Jurnal makanan harian Anda.
- **Kategori (`/kategori`)**: Eksplorasi database nutrisi makanan.
- **Profil (`/profil`)**: Pengaturan data fisik dan target personal.

---

## ⚖️ Hukum & Privasi
Proyek ini dilengkapi dengan halaman [Kebijakan Privasi](/privacy) dan [Ketentuan Layanan](/terms) yang transparan untuk menjaga keamanan data pengguna.

---

## 👨‍💻 Tim Pengembang
Dibuat oleh **Farel Indra Syahputra** untuk pengembangan teknologi nutrisi masa depan.
