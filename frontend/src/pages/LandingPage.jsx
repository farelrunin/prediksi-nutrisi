import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, TrendingUp, Apple } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const LandingPage = () => {
  const { user } = useAuth();
  const ctaLabel = user ? 'Prediksi Sekarang' : 'Daftar Sekarang';
  const ctaLink = user ? '/nutri-check' : '/register';

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] overflow-x-hidden">
      {/* Background with user image */}
      {/* Background Image - Clean & Sharp */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bg-food.jpg"
          alt="Healthy Food"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative max-w-2xl animate-in fade-in slide-in-from-left duration-1000">
            {/* Organic "Cloud/Graffiti" Blur Effect - Tightened and shifted */}
            <div className="absolute -inset-4 z-0 overflow-visible pointer-events-none opacity-70">
              <div className="absolute top-4 left-0 w-[60%] h-[40%] bg-white rounded-full blur-[60px]" />
              <div className="absolute bottom-10 left-4 w-[50%] h-[40%] bg-white/80 rounded-full blur-[70px]" />
              <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-white/60 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 ml-1">
                <Sparkles size={16} className="text-slate-900" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">AI-Powered Nutrition Assistant</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8">
                Makan Enak, <br />
                <span className="text-[var(--primary-green)] drop-shadow-[0_0_15px_rgba(255,255,255,1)]">Gizi Terjaga.</span>
              </h1>
              <p className="text-lg text-[var(--text-main)] leading-relaxed mb-10 max-w-lg font-bold opacity-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                NutriAI membantu Anda memantau asupan harian dengan cerdas. Dapatkan analisis mendalam dan rekomendasi menu yang personal hanya dalam hitungan detik.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  to={ctaLink}
                  className="group relative flex items-center justify-center rounded-2xl bg-[var(--primary-green)] px-10 py-5 text-base font-bold text-white shadow-2xl shadow-emerald-500/40 transition-all hover:scale-105 active:scale-100"
                >
                  {ctaLabel}
                </Link>
                <a
                  href="#fitur"
                  className="flex items-center justify-center rounded-2xl border border-white bg-white/40 backdrop-blur-sm px-10 py-5 text-base font-bold text-[var(--text-main)] transition-all hover:bg-white/60 shadow-xl"
                >
                  Lihat Fitur
                </a>
              </div>
            </div>
          </div>

          {/* Feature Image / Visual Placeholder (Removed Daily Insight as requested) */}
          <div className="hidden lg:block relative animate-in fade-in slide-in-from-right duration-1000">
            {/* You can add a subtle illustrative image or just leave it empty for a minimalist look */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-32 relative z-10 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--primary-green)] mb-4">Fitur Utama</h2>
            <p className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">Cerdas, Cepat, <br /> dan Terukur.</p>
            <p className="text-[var(--text-muted)] text-lg font-medium">Teknologi AI kami dirancang untuk memudahkan hidup sehat Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: ShieldCheck,
                title: 'Data Terjamin',
                desc: 'Seluruh riwayat makanan Anda tersimpan aman dan terorganisir dengan rapi.'
              },
              {
                icon: TrendingUp,
                title: 'Analisis Mendalam',
                desc: 'Pantau grafik perkembangan nutrisi Anda setiap hari secara otomatis.'
              },
              {
                icon: Sparkles,
                title: 'Rekomendasi AI',
                desc: 'Dapatkan saran makanan dari Gemini AI berdasarkan kebutuhan tubuh Anda.'
              }
            ].map((f, i) => (
              <div key={i} className="group p-12 rounded-[2.5rem] bg-[var(--bg-card)] border border-[var(--border-card)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[var(--bg-primary)] text-[var(--primary-green)] mb-8 group-hover:scale-110 transition-transform">
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-base leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Kerja Section */}
      <section id="cara-kerja" className="py-32 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--primary-green)]">Cara Kerja</h2>
                <p className="text-4xl lg:text-5xl font-extrabold tracking-tight">Hanya 3 Langkah <br /> Menuju Hidup Sehat.</p>
              </div>

              <div className="space-y-10">
                {[
                  { step: '01', title: 'User story', desc: 'ketik apa yang Anda makan hari ini.' },
                  { step: '02', title: 'Analisis AI', desc: 'Mesin AI kami akan menghitung kalori, protein, karbohidrat, dan lemak secara instan.' },
                  { step: '03', title: 'Dapatkan Rekomendasi', desc: 'Terima saran personal untuk menjaga keseimbangan nutrisi harian Anda.' }
                ].map((s) => (
                  <div key={s.step} className="flex gap-8 group">
                    <span className="text-4xl font-black text-[var(--primary-green)]/20 group-hover:text-[var(--primary-green)] transition-colors duration-300">{s.step}</span>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold">{s.title}</h4>
                      <p className="text-[var(--text-muted)] font-medium leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--primary-green)]/20 to-[var(--accent-blue)]/20 rounded-[3rem] blur-2xl" />
              <div className="relative rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl">
                <img src="/bg-food.jpg" alt="Health App" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-12">
                  <p className="text-white text-xl font-bold italic">"Kesehatan dimulai dari apa yang Anda Makan."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 relative z-20 bg-[var(--bg-primary)] border-t border-[var(--border-card)]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16">
          <div className="col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[var(--primary-green)] rounded-xl shadow-lg shadow-emerald-500/20">
                <Apple className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tighter">NutriAI</h2>
            </div>
            <p className="text-[var(--text-muted)] text-base max-w-sm leading-relaxed font-medium">
              Membangun masa depan yang lebih sehat melalui teknologi kecerdasan buatan. Kami membantu Anda mencintai tubuh Anda melalui nutrisi yang tepat.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-[var(--text-main)]">Navigasi</h4>
            <ul className="space-y-5 text-base font-semibold text-[var(--text-muted)]">
              <li><a href="#fitur" className="hover:text-[var(--primary-green)] transition-colors">Fitur</a></li>
              <li><a href="#cara-kerja" className="hover:text-[var(--primary-green)] transition-colors">Cara Kerja</a></li>
              <li><Link to="/login" className="hover:text-[var(--primary-green)] transition-colors">Masuk</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-[var(--text-main)]">Kontak</h4>
            <ul className="space-y-5 text-base font-semibold text-[var(--text-muted)]">
              <li className="flex items-center gap-2 hover:text-[var(--text-main)] transition-colors cursor-default">
                <span>farelrunin@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 cursor-default">
                <span>Yogyakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t border-[var(--border-card)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-slate-400">&copy; 2024 NutriAI. All rights reserved.</p>
          <div className="flex gap-10 text-sm font-bold text-slate-400">
            <Link to="/privacy" className="hover:text-[var(--primary-green)] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[var(--primary-green)] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
