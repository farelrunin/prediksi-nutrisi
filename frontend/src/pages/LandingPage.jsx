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
            {/* Organic Blur Effect */}
            <div className="absolute -inset-4 z-0 overflow-visible pointer-events-none opacity-60">
              <div className="absolute top-4 left-0 w-[55%] h-[35%] bg-white rounded-full blur-[40px]" />
              <div className="absolute bottom-10 left-4 w-[45%] h-[35%] bg-white/70 rounded-full blur-[50px]" />
              <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[65%] h-[55%] bg-white/60 rounded-full blur-[60px]" />
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
              { icon: ShieldCheck, title: 'Data Terjamin', desc: 'Seluruh riwayat makanan Anda tersimpan aman dan terorganisir dengan rapi.' },
              { icon: TrendingUp, title: 'Analisis Mendalam', desc: 'Pantau grafik perkembangan nutrisi Anda setiap hari secara otomatis.' },
              { icon: Sparkles, title: 'Rekomendasi AI', desc: 'Dapatkan saran makanan dari Gemini AI berdasarkan kebutuhan tubuh Anda.' }
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
                  { step: '01', title: 'User story', desc: 'Ketik apa yang Anda makan hari ini.' },
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

      {/* Footer Section */}
      <footer className="relative pt-24 pb-12 overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/bg-food.jpg"
            alt="Footer Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            <div className="md:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[var(--primary-green)] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-white font-black text-2xl">N</span>
                </div>
                <span className="text-3xl font-black tracking-tighter text-slate-950">NutriAI</span>
              </div>
              <p className="text-slate-950 text-lg font-bold leading-relaxed max-w-md">
                Membangun masa depan yang lebih sehat melalui teknologi kecerdasan buatan. 
                Kami membantu Anda mencintai tubuh Anda melalui nutrisi yang tepat.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <a key={social} href="#" className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all shadow-sm">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-current opacity-20 rounded-full" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-slate-950 font-black uppercase tracking-[0.2em] text-xs mb-8 text-left">Navigasi</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Home', link: '/' },
                  { name: 'Fitur Utama', link: '#fitur' },
                  { name: 'Cara Kerja', link: '#cara-kerja' },
                  { name: 'Kategori Makanan', link: '/kategori' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link to={item.link} className="text-slate-950 font-bold hover:text-[var(--primary-green)] transition-colors flex items-center gap-2 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-green)] opacity-0 group-hover:opacity-100 transition-all" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-slate-950 font-black uppercase tracking-[0.2em] text-xs mb-8 text-left">Dukungan</h4>
              <ul className="space-y-4">
                <li><Link to="/privacy" className="text-slate-950 font-bold hover:text-[var(--primary-green)] transition-colors">Kebijakan Privasi</Link></li>
                <li><Link to="/terms" className="text-slate-950 font-bold hover:text-[var(--primary-green)] transition-colors">Syarat & Ketentuan</Link></li>
                <li className="pt-4 border-t border-slate-200">
                  <span className="block text-slate-950 text-[10px] font-black uppercase tracking-widest mb-2">Kontak Bantuan:</span>
                  <a href="mailto:farelrunin@gmail.com" className="text-slate-950 font-black hover:text-[var(--primary-green)] transition-colors break-all">farelrunin@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-950 font-bold text-sm">
              &copy; 2026 NutriAI. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link to="/privacy" className="text-slate-950 font-bold text-sm hover:text-[var(--primary-green)] transition-colors">Privacy</Link>
              <Link to="/terms" className="text-slate-950 font-bold text-sm hover:text-[var(--primary-green)] transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
