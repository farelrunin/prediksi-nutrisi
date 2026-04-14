import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, TrendingUp, Apple } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden min-h-screen bg-[#06140f] text-white">

      {/* BACKGROUND EFFECT */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.25),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.15),_transparent_20%)]" />

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:px-8">
        
        <div className="flex flex-col-reverse gap-16 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}
          <div className="w-full lg:w-1/2 max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-emerald-300 ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Solusi Nutrisi Sehat & Akurat
            </p>

            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
              <Apple size={24} />
            </div>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Prediksi Nutrisi Pintar untuk Hidup yang Lebih Sehat
            </h1>

            <p className="mt-6 text-lg text-slate-300">
              Pantau asupan gizi, dapatkan rekomendasi makanan personal,
              dan lihat risiko kesehatan secara visual dengan antarmuka modern.
            </p>

            {/* BUTTON */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="rounded-full bg-emerald-500 px-8 py-3 font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                Mulai Sekarang
              </Link>

              <Link
                to="/login"
                className="rounded-full border border-white/20 px-8 py-3 font-semibold hover:border-emerald-300 hover:bg-white/10"
              >
                Masuk
              </Link>
            </div>

            {/* STATS */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: '16+', label: 'Tahun Pengalaman' },
                { value: '250+', label: 'Partner Klinik' },
                { value: '18+', label: 'Metode Teruji' },
                { value: '10.2k+', label: 'Pengguna Aktif' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xl font-semibold">{item.value}</p>
                  <p className="text-xs text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT (CARD) */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">

              {/* GLOW */}
              <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="absolute -right-10 bottom-4 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

              {/* CARD */}
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                
                <div className="flex justify-between text-sm text-slate-300">
                  <span className="bg-white/10 px-3 py-1 rounded-full">Health Card</span>
                  <span className="bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-300">AI</span>
                </div>

                <div className="mt-8 text-3xl tracking-widest font-semibold">
                  1682 0911 2019 2021
                </div>

                <div className="mt-8 flex justify-between text-sm">
                  <div>
                    <p className="text-slate-400 text-xs">NAME</p>
                    <p className="font-semibold">REHAN RAHMAN</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">EXP</p>
                    <p className="font-semibold">09/11</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-white/10 py-16 bg-[#071a14]/80">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <p className="text-sm text-emerald-300 uppercase tracking-widest">
              Apa yang kami tawarkan
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Solusi Nutrisi Modern dan Aman
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <ShieldCheck className="mb-4 text-emerald-300" size={28} />
              <h3 className="font-semibold text-lg">Keamanan Terjamin</h3>
              <p className="text-slate-300 mt-2 text-sm">
                Data Anda aman dengan enkripsi modern.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <TrendingUp className="mb-4 text-sky-300" size={28} />
              <h3 className="font-semibold text-lg">Prediksi Risiko AI</h3>
              <p className="text-slate-300 mt-2 text-sm">
                Rekomendasi berbasis machine learning.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <Sparkles className="mb-4 text-violet-300" size={28} />
              <h3 className="font-semibold text-lg">Pengalaman Personal</h3>
              <p className="text-slate-300 mt-2 text-sm">
                UI modern dan mudah digunakan.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;