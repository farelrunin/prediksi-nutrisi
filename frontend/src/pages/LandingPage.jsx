import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, TrendingUp, Apple } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const LandingPage = () => {
  const { user } = useAuth();
  const ctaLabel = user ? 'Prediksi Sekarang' : 'Mulai Sekarang';
  const ctaLink = user ? '/dashboard' : '/register';

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#06140f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_30%)]" />

      <section id="hero" className="relative z-10 min-h-screen flex items-center bg-cover bg-center" style={{ backgroundImage: "url('/bg-food.jpg')" }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm sm:backdrop-blur-none"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-white drop-shadow-lg">
              Mudah catat gizi, dapatkan rekomendasi makanan yang relevan.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-200 drop-shadow-md">
              NutrisiAI membantu Anda mengatur asupan sehari-hari dengan cepat, menjaga konsistensi, dan membuat keputusan pola makan lebih mudah.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to={ctaLink}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                {ctaLabel}
              </Link>
              <a
                href="#cara-kerja"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-md px-8 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="relative z-10 border-t border-white/10 bg-[#061814]/80 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl text-center mx-auto">
            <p className="text-sm text-emerald-300 uppercase tracking-widest">Kenapa pakai aplikasi ini?</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Sederhana, cepat, dan fokus pada gizi.</h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Mudah mencatat data',
                description: 'Catat asupan harian tanpa repot dan simpan riwayat secara otomatis.',
              },
              {
                icon: TrendingUp,
                title: 'Analisis lebih cepat',
                description: 'Dapatkan ringkasan gizi dan rekomendasi dengan tampilan yang jelas.',
              },
              {
                icon: Sparkles,
                title: 'Tampilan yang ringan',
                description: 'Desain minimal membuat informasi lebih mudah dipahami dalam sekejap.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                  <item.icon size={22} />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-slate-300 text-sm leading-6">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tentang" className="relative z-10 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <p className="text-sm text-emerald-300 uppercase tracking-widest">Apa itu NutrisiAI?</p>
              <h2 className="text-3xl font-semibold text-white">Aplikasi sederhana untuk bantu jaga pola makan.</h2>
              <p className="max-w-xl text-lg leading-8 text-slate-300">
                NutrisiAI menyelesaikan kebingungan memilih menu sehat dengan memberikan gambaran gizi yang mudah dibaca, rekomendasi cepat, dan ringkasan yang bisa diikuti setiap hari.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
              <div className="rounded-3xl bg-[#061d17] p-6">
                <div className="mb-6 flex items-center justify-between text-sm text-slate-400">
                  <span>Ringkasan harian</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Simple</span>
                </div>
                <div className="space-y-5">
                  <div className="rounded-3xl bg-[#081d19] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Kalori</p>
                    <p className="mt-3 text-2xl font-semibold text-white">1.520 kkal</p>
                  </div>
                  <div className="rounded-3xl bg-[#081d19] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Protein</p>
                    <p className="mt-3 text-2xl font-semibold text-white">65 g</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cara-kerja" className="relative z-10 border-t border-white/10 bg-[#061814]/80 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl text-center mx-auto">
            <p className="text-sm text-emerald-300 uppercase tracking-widest">Cara Kerja</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Gunakan dalam 3 langkah sederhana</h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Input data',
                description: 'Masukkan makanan dan jumlah yang Anda konsumsi setiap hari.',
              },
              {
                step: '02',
                title: 'Sistem menganalisis',
                description: 'Aplikasi menghitung gizi dan memberikan ringkasan yang jelas.',
              },
              {
                step: '03',
                title: 'Lihat hasil',
                description: 'Terima rekomendasi dan gunakan informasi untuk rencana makan yang lebih baik.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-slate-300 text-sm leading-6">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-2xl shadow-black/20">
            <p className="text-sm text-emerald-300 uppercase tracking-widest">Siap mulai?</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Buat pola makan lebih teratur dengan lebih sedikit kebingungan.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">NutrisiAI dirancang untuk membuat pencatatan gizi jadi cepat dan bisa dipahami oleh siapa saja.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                Daftar Sekarang
              </Link>
              <a
                href="#fitur"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                Lihat Fitur
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="relative z-10 border-t border-white/10 bg-[#05100a] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white">
                  <Apple size={20} />
                </div>
                <div>
                  <p className="text-base font-semibold">NutrisiAI</p>
                  <p className="text-sm text-slate-400">Landing page yang ringan dan jelas.</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Menu</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#hero" className="hover:text-white">Home</a></li>
                <li><a href="#fitur" className="hover:text-white">Fitur</a></li>
                <li><a href="#tentang" className="hover:text-white">Tentang</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Kontak</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>support@nutrisiai.com</li>
                <li>+62 123 456 7890</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
            <p>&copy; 2024 NutrisiAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
