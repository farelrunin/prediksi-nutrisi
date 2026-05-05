# NutriAI 🥗

**NutriAI** adalah aplikasi cerdas berbasis web yang dirancang untuk membantu pengguna melacak asupan nutrisi harian mereka, memprediksi risiko malnutrisi menggunakan teknologi NLP, dan memberikan rekomendasi diet berbasis Artificial Intelligence. 

## 🌟 Fitur Utama
- **Autentikasi User**: Sistem pendaftaran dan login aman yang menggunakan token JWT.
- **Input Nutrisi via NLP**: Pengguna cukup menceritakan makanan mereka (misalnya: *"Pagi ini saya makan nasi padang dan minum es teh"*), lalu sistem akan secara otomatis mengekstrak porsi, makanan, dan mengkalkulasi jumlah nutrisi.
- **Dashboard Nutrisi Interaktif**: Menyajikan ringkasan kalori, protein, karbohidrat, dan lemak harian melalui grafik visual.
- **Analisis AI**: Mengukur risiko gizi berdasarkan asupan kalori dan memberikan rekomendasi pola makan yang dipersonalisasi.
- **Desain Modern**: Antarmuka *Dark Theme* elegan yang memadukan teknik *Glassmorphism* dan warna yang memanjakan mata.

---

## 🛠️ Tech Stack
- **Frontend**: React + Vite, TailwindCSS (Vanilla CSS styling), Lucide React (Icons).
- **Backend**: FastAPI (Python), SQLAlchemy (ORM).
- **Database**: SQLite (Development) / MySQL.
- **Fitur AI**: Custom Rule-Based NLP Parser untuk ekstraksi entitas makanan bahasa Indonesia.

---

## 🚀 Panduan Instalasi (Cara Clone & Menjalankan Sistem)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini secara lokal di komputermu.

### 1. Clone Repository
```bash
git clone https://github.com/farelrunin/prediksi-nutrisi.git
cd prediksi-nutrisi
```

### 2. Setup Backend (FastAPI)
1. Buka terminal baru dan masuk ke folder `backend`.
```bash
cd backend
```
2. Buat Virtual Environment (Opsional tapi disarankan).
```bash
python -m venv venv
venv\Scripts\activate      # Untuk Windows
source venv/bin/activate   # Untuk Mac/Linux
```
3. Install semua *dependencies*.
```bash
pip install -r requirements.txt
```
4. Jalankan server FastAPI.
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*Backend akan berjalan di `http://localhost:8000`*

### 3. Setup Frontend (React + Vite)
1. Buka tab terminal baru (biarkan terminal backend tetap berjalan), lalu masuk ke folder `frontend`.
```bash
cd frontend
```
2. Install modul Node.js.
```bash
npm install
```
3. Tambahkan aset gambar untuk *Landing Page*.
   Pastikan Anda menaruh gambar dengan nama `bg-food.jpg` di dalam folder `frontend/public/` agar tampilan background beranda muncul dengan sempurna.
4. Jalankan server React (Vite).
```bash
npm run dev
```
*Frontend akan berjalan dan bisa diakses di `http://localhost:5173`*

---

## 📸 Struktur Halaman
- **`/` (Landing Page)**: Halaman depan untuk perkenalan aplikasi.
- **`/login` & `/register`**: Halaman masuk dan daftar dengan tampilan antarmuka transparan (*glassmorphism*).
- **`/dashboard`**: Laporan ringkasan nutrisi harian.
- **`/nutri-check`**: Halaman untuk input makanan dengan fitur cerita alami (NLP).
- **`/kategori`**: Menampilkan ratusan database makanan yang dikelompokkan otomatis.

## 🤝 Tim Pengembang
Proyek ini dibuat untuk tugas pengembangan sistem dan AI.
- **Farel Indra Syahputra** 
