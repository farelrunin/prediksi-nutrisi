# 📊 Business Model Canvas (BMC) — NutriAI
> **NutriAI — Monitoring nutrisi jadi lebih cerdas, sehat, dan bergaya.**

Dokumen ini memetakan strategi bisnis, proposisi nilai, infrastruktur, dan analisis keuangan proyek **NutriAI** ke dalam 9 elemen penting *Business Model Canvas*. Analisis ini dirancang secara spesifik berdasarkan fitur nyata aplikasi gizi cerdas kita (seperti AI NLP, Scan Foto TensorFlow Lokal, Mode Khusus Bumil/Busui, dan Database Gizi Indonesia).

---

## 🎨 Matriks Business Model Canvas

| **Key Partnerships (Kemitraan Utama)** | **Key Activities (Aktivitas Utama)** | **Value Propositions (Proposisi Nilai)** | **Customer Relationships (Hubungan Pelanggan)** | **Customer Segments (Segmen Pelanggan)** |
| :--- | :--- | :--- | :--- | :--- |
| • **Ahli Gizi & Faskes**: Validasi database & saran medis.<br>• **Katering Sehat**: Afiliasi menu harian.<br>• **Gym & Fitness Center**: Bundling langganan premium.<br>• **Penyedia Layanan Cloud**: Railway / AWS hosting. | • **UI/UX & App Dev**: Perawatan aplikasi premium.<br>• **Retraining Model AI**: Optimasi akurasi TensorFlow.<br>• **Ekspansi Pustaka Makanan**: Penambahan kuliner lokal.<br>• **Edukasi & Pemasaran**: Kampanye hidup sehat. | • **NLP Cek Nutrisi**: Input asupan praktis via teks alami.<br>• **Instant TensorFlow Scan**: Scan foto makanan instan.<br>• **Personalized AKG & TDEE**: Target dinamis fisik.<br>• **Bumil & Busui Mode**: Gizi khusus ibu hamil/menyusui.<br>• **Risk Score AI**: Peringatan malnutrisi instan. | • **Personalized Coach AI**: Saran makan yang sangat pas.<br>• **Gamifikasi Habit**: Fitur *Streak* harian pencatatan.<br>• **Layanan Bantuan 24/7**: Support teknis.<br>• **Komunitas Sehat**: Wadah sharing menu sehat dalam app. | • **Healthy Lifestyle Enthusiasts**: Pelaku diet & olahragawan.<br>• **Ibu Hamil & Menyusui**: Butuh AKG khusus (Bumil/Busui).<br>• **Busy Professionals**: Pekerja sibuk butuh input instan.<br>• **Pasien Terapi Gizi**: Butuh memantau risiko kesehatan. |
| | **Key Resources (Sumber Daya Utama)** | | **Channels (Saluran Pemasaran)** | |
| | • **Teknologi Cerdas**: TensorFlow, Express, React.<br>• **Database Gizi Lokal**: 8.500+ pustaka makanan Indonesia.<br>• **Talenta Ahli**: AI engineer, nutritionist, fullstack developer. | | • **Digital App Stores**: Google Play & App Store.<br>• **Media Sosial Cerdas**: Instagram & TikTok.<br>• **B2B Offline Partner**: Brosur di klinik gizi & gym.<br>• **Word-of-Mouth**: Komunitas ibu & kesehatan. | |
| **Cost Structure (Struktur Biaya)** | | | **Revenue Streams (Aliran Pendapatan)** | |
| • **Biaya Infrastruktur**: Hosting server Express & database MySQL.<br>• **Biaya Operasional**: Gaji tim pengembang & data scientist.<br>• **Biaya Validasi**: Konsultasi & lisensi data gizi medis.<br>• **Biaya Pemasaran**: Iklan digital & kampanye influencer gizi. | | | • **Freemium & Subscription (NutriAI Pro)**: Langganan bulanan/tahunan.<br>• **B2B Enterprise License**: API untuk klinik gizi & katering.<br>• **Komisi Afiliasi**: Komisi pemesanan katering sehat dalam aplikasi.<br>• **B2B Corporate Wellness**: Paket langganan untuk kesehatan karyawan. | |

---

## 🔍 Penjelasan Mendalam 9 Elemen BMC NutriAI

### 1. 👥 Customer Segments (Segmen Pelanggan)
* **Healthy Lifestyle Enthusiasts**: Individu aktif yang ingin menjaga bentuk badan, menghitung defisit/surplus kalori, dan memantau makronutrisi harian secara ketat.
* **Ibu Hamil (Bumil) & Menyusui (Busui)**: Segmen premium yang membutuhkan asupan kalori & mikro-nutrisi dinamis yang jauh lebih tinggi. Mode Bumil/Busui di aplikasi kita menjadi solusi terbaik untuk mereka.
* **Busy Professionals / Urban Workers**: Pekerja kantoran yang tidak sempat menginput data gizi secara manual satu per satu, sehingga sangat terbantu dengan kepraktisan NLP Story & Foto Scan.
* **Pasien Terapi Gizi**: Individu yang membutuhkan pemantauan klinis mandiri untuk mendeteksi dini risiko malnutrisi atau obesitas (fitur *Risk Score*).

### 2. 💎 Value Propositions (Proposisi Nilai)
* **NLP Cek Nutrisi (Pencatatan Alami)**: Solusi pencatatan makanan instan lewat teks percakapan biasa (seperti *"Makan nasi uduk pakai telur ceplok"*). Sistem langsung menebak porsi dan gizi secara otomatis lewat database lokal.
* **Instant TensorFlow Scan (AI Kamera Lokal)**: Analisis gambar instan menggunakan model TensorFlow buatan sendiri untuk memprediksi gizi makanan tanpa ribet.
* **Smart Personalized Target (BMR, TDEE, AKG)**: Perhitungan asupan gizi harian yang tidak statis, melainkan adaptif mengikuti perubahan berat badan, tinggi badan, tingkat aktivitas, hingga fase kehamilan.
* **Deteksi Risiko Malnutrisi & AI Advice**: Memberikan saran kesehatan deterministik dan mengukur tingkat risiko malnutrisi harian pengguna berdasarkan pola makannya.
* **Zero Latency & Hemat Biaya**: Karena backend dirancang hemat biaya (menggunakan database lokal untuk NLP dan model TensorFlow mandiri), aplikasi berjalan sangat cepat tanpa beban langganan API mahal.

### 3. 📣 Channels (Saluran Pemasaran)
* **Digital App Stores**: Distribusi aplikasi utama di Android Play Store dan iOS App Store.
* **Media Sosial (Content-Driven)**: Konten edukasi visual di Instagram Reels dan TikTok yang memperagakan kemudahan *"Jepret Makanan, Gizi Langsung Keluar"* di NutriAI.
* **B2B Referral**: Rekomendasi langsung dari dokter spesialis kandungan/anak, bidan, dan personal trainer di pusat kebugaran.

### 4. 🤝 Customer Relationships (Hubungan Pelanggan)
* **Gamifikasi Harian (Habit Loop)**: Membangun kebiasaan mencatat melalui fitur **Streak Harian** dan sistem badge pencapaian (misal: *Streak 7 Hari Makan Sehat*).
* **AI Personal Diet Coach**: Memberikan saran dan dorongan personal seolah-olah pengguna memiliki ahli gizi pribadi di genggamannya.
* **E-Newsletter & Tips Kesehatan**: Pengiriman berkala tips nutrisi ilmiah berbasis kondisi tubuh pengguna secara berkala ke email mereka.

### 5. 💰 Revenue Streams (Aliran Pendapatan)
* **NutriAI Pro Subscription (B2C)**: Model freemium di mana fitur dasar gratis, sedangkan fitur premium membutuhkan langganan (Bulanan: Rp 29.000 / Tahunan: Rp 199.000) untuk:
  - Akses tak terbatas ke AI Kamera (TensorFlow Scan).
  - Mode Kehamilan (Bumil) & Menyusui (Busui) tingkat lanjut.
  - Laporan grafik kesehatan mingguan yang bisa diexport ke PDF untuk dokter.
* **B2B Enterprise License**: Penyediaan lisensi khusus API NutriAI untuk klinik gizi, instansi rumah sakit, atau penyedia katering diet.
* **Komisi Afiliasi Katering Sehat**: Komisi 5% - 10% setiap kali ada pengguna yang memesan menu makanan sehat dari mitra katering diet langsung di dalam aplikasi NutriAI.

### 6. ⚙️ Key Activities (Aktivitas Utama)
* **Pengembangan & Perawatan Software**: Menjaga keandalan arsitektur fullstack Express, React, dan FastAPI Python agar tetap stabil.
* **Retraining Model TensorFlow**: Terus melatih model klasifikasi gambar tim AI dengan variasi gambar makanan baru agar akurasi deteksi meningkat secara bertahap.
* **Pemeliharaan Database**: Mengoptimalkan database MySQL serta memperluas pustaka nilai gizi masakan nusantara.
* **Pemasaran & Akuisisi Pengguna**: Melakukan promosi digital untuk menarik segmen pengguna baru.

### 7. 🎒 Key Resources (Sumber Daya Utama)
* **Arsitektur Teknologi**: Kode program yang terintegrasi rapi antara Frontend React, Backend Express Node.js, Database MySQL, dan FastAPI.
* **Pustaka Gizi Terintegrasi**: Database 8.500+ jenis makanan khas Indonesia yang terkalibrasi.
* **Tim Inti Profesional**: Kolaborasi apik antara Fullstack Developer, Data Scientist, UI/UX Designer, dan Nutritionist.

### 8. 🤝 Key Partnerships (Kemitraan Utama)
* **Persatuan Ahli Gizi / Nutritionist**: Bekerja sama untuk memvalidasi algoritma saran kecerdasan buatan agar sesuai standar klinis medis Kemenkes.
* **Mitra Katering Sehat & Organik**: Bekerja sama dengan penyedia katering sehat lokal untuk integrasi pembelian menu gizi seimbang.
* **Pusat Kebugaran (Gym & Wellness Center)**: Kerja sama paket bundling keanggotaan gym yang di dalamnya sudah termasuk akses NutriAI Pro.

### 9. 💸 Cost Structure (Struktur Biaya)
* **Server & Cloud Infrastructure**: Biaya bulanan hosting web online di Railway/AWS serta pemeliharaan server database MySQL cloud.
* **Operational & Payroll**: Gaji pengembang perangkat lunak, data scientist, dan kompensasi ahli gizi eksternal.
* **Customer Acquisition (Marketing)**: Biaya iklan berbayar (Meta Ads, Google Ads) untuk menjaring pengguna baru.
* **Licensing & Data Validation**: Biaya sertifikasi medis dan legalitas data gizi.

---

> [!TIP]
> **Mengapa BMC ini sangat solid?**
> Berbeda dengan aplikasi kesehatan lain yang bergantung pada API eksternal yang mahal (seperti OpenAI/Gemini), **NutriAI memiliki infrastruktur mandiri** (model TensorFlow lokal & MySQL query). Hal ini membuat **Cost Structure kita sangat rendah** sehingga potensi keuntungan dari **Revenue Streams** menjadi sangat besar dengan margin keuntungan bersih yang tinggi!
