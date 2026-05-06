# NutriAI — Premium AI Nutrition Dashboard

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

---

## 👨‍💻 Tim Pengembang
Dibuat oleh **Farel Indra Syahputra** untuk pengembangan teknologi nutrisi masa depan.

---

## 🔒 Security Implementation Checklist & Roadmap

Berikut adalah status keamanan sistem NutriAI saat ini:

### ✅ Keamanan yang Sudah Diperketat (Hardened)
- [x] **Backend Pydantic Validation**: Semua input API (Register, Login, Profile) divalidasi menggunakan skema Pydantic yang ketat (`EmailStr`, `min_length`, `max_length`).
- [x] **Frontend HTML5 Constraints**: Penambahan atribut `minLength`, `maxLength`, serta `min/max` pada input numerik untuk mencegah data tidak logis (misal: usia 999 tahun).
- [x] **Password Security**: Minimal 8 karakter diwajibkan di sisi client dan server untuk mencegah password lemah.
- [x] **Secure NLP Pipeline**: Penambahan `maxLength="1000"` pada input cerita makanan untuk mencegah serangan *Large String Injection* yang bisa membebani AI.
- [x] **Database Sanitation**: Menggunakan ORM SQLAlchemy yang secara otomatis melakukan parameterisasi query untuk mencegah *SQL Injection*.
- [x] **Input Error Handling**: Pesan error dari server kini difilter dan diparsing agar tidak membocorkan detail teknis sistem ke pengguna (mencegah *Information Leakage*).

### 🚀 Kelebihan Sistem Saat Ini
- **Resilient**: Sistem tidak mudah *crash* jika diberi input teks yang sangat besar atau format yang salah.
- **User-Friendly Security**: Fitur "Show Password" membantu keamanan pengguna dalam mencegah kesalahan ketik sandi tanpa mengurangi proteksi.
- **API Integrity**: Server akan menolak permintaan ilegal meskipun pengguna mencoba memintas (bypass) validasi antarmuka.

### ⚠️ Area Rawan (Future Roadmap)
- [ ] **Rate Limiting**: Saat ini belum ada pembatasan jumlah percobaan login per menit (rawan serangan *Brute Force*).
- [ ] **File Upload Security**: Belum ada validasi tipe file (magic bytes) yang ketat untuk unggahan foto profil (saat ini hanya bergantung pada ekstensi).
- [ ] **Account Lockout**: Belum ada sistem blokir akun sementara jika salah password berkali-kali.
- [ ] **2FA (Two-Factor Authentication)**: Belum tersedia untuk keamanan ekstra akun pengguna.
