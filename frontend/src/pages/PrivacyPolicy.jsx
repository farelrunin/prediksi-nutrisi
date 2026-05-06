import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>

        <div className="bg-white border border-[var(--border-card)] rounded-[3rem] p-12 md:p-20 shadow-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-[var(--primary-green)]/10 rounded-2xl text-[var(--primary-green)]">
              <Shield size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)]">Kebijakan Privasi</h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-[var(--text-main)] font-medium opacity-90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-bold">1. Pendahuluan</h2>
              <p>
                Selamat datang di NutriAI. Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan layanan kami.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">2. Informasi yang Kami Kumpulkan</h2>
              <p>
                Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, seperti saat Anda membuat akun, memasukkan data makanan, atau menghubungi layanan pelanggan. Ini termasuk:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Informasi Identitas: Nama, alamat email, dan foto profil.</li>
                <li>Data Fisik: Tinggi badan, berat badan, usia, dan jenis kelamin.</li>
                <li>Data Nutrisi: Riwayat makanan, target kalori, dan preferensi diet.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">3. Penggunaan Informasi</h2>
              <p>
                Kami menggunakan informasi yang kami kumpulkan untuk:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Menyediakan dan memelihara layanan NutriAI.</li>
                <li>Memberikan rekomendasi nutrisi yang dipersonalisasi melalui AI.</li>
                <li>Menganalisis penggunaan aplikasi untuk meningkatkan fitur dan pengalaman pengguna.</li>
                <li>Mengirimkan pemberitahuan penting terkait akun Anda.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">4. Keamanan Data</h2>
              <p>
                Keamanan data Anda adalah prioritas kami. Kami menggunakan teknologi enkripsi standar industri untuk melindungi informasi Anda dari akses yang tidak sah. Namun, harap diingat bahwa tidak ada metode transmisi data melalui internet yang 100% aman.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">5. Kontak Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di <span className="text-[var(--primary-green)] font-bold">farelrunin@gmail.com</span>.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 text-sm text-[var(--text-muted)] text-center">
            Terakhir diperbarui: 6 Mei 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
