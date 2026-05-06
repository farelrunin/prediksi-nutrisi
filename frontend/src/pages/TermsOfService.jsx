import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
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
              <FileText size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)]">Ketentuan Layanan</h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-[var(--text-main)] font-medium opacity-90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-bold">1. Penerimaan Ketentuan</h2>
              <p>
                Dengan mengakses dan menggunakan NutriAI, Anda setuju untuk terikat oleh Ketentuan Layanan ini. Jika Anda tidak setuju dengan bagian apa pun dari ketentuan ini, Anda tidak diperbolehkan menggunakan layanan kami.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">2. Penggunaan Layanan</h2>
              <p>
                NutriAI menyediakan alat untuk memantau nutrisi dan memberikan rekomendasi berbasis AI. Layanan ini hanya untuk tujuan informasi dan tidak boleh dianggap sebagai saran medis profesional. Selalu berkonsultasi dengan ahli gizi atau dokter sebelum memulai diet baru.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">3. Akun Pengguna</h2>
              <p>
                Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun dan password Anda. Anda setuju untuk bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">4. Konten Pengguna</h2>
              <p>
                Anda memiliki semua data yang Anda masukkan ke dalam aplikasi. Namun, dengan memasukkan data, Anda memberikan kami hak untuk memproses data tersebut guna memberikan layanan yang dipersonalisasi.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">5. Pembatalan dan Penangguhan</h2>
              <p>
                Kami berhak untuk menangguhkan atau menghentikan akses Anda ke layanan kapan saja, tanpa pemberitahuan sebelumnya, untuk perilaku yang kami anggap melanggar ketentuan ini atau merugikan pengguna lain.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">6. Perubahan Ketentuan</h2>
              <p>
                Kami dapat memperbarui Ketentuan Layanan ini dari waktu ke waktu. Perubahan akan berlaku segera setelah diposting di halaman ini. Penggunaan berkelanjutan Anda atas layanan setelah perubahan berarti Anda menerima ketentuan baru tersebut.
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

export default TermsOfService;
