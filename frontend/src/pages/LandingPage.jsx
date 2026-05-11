import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, TrendingUp, Apple, Globe, Camera, Briefcase } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import SoftAurora from '../components/shared/SoftAurora';

const LandingPage = () => {
  const { user } = useAuth();
  const ctaLabel = user ? 'Check Nutrition' : 'Join Now';
  const ctaLink = user ? '/nutri-check' : '/register';

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] overflow-x-hidden">
      {/* Background - Animated Soft Aurora */}
      <div className="fixed inset-0 z-0 bg-[#060a09]"> {/* Very dark green base */}
        <SoftAurora
          speed={0.4}
          scale={1.2}
          brightness={0.8}
          color1="#22c55e" // Emerald 500
          color2="#3b82f6" // Blue 500
          noiseFrequency={2.0}
          noiseAmplitude={0.8}
          bandHeight={0.4}
          bandSpread={1.2}
          enableMouseInteraction={true}
          mouseInfluence={0.15}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/40 to-[var(--bg-primary)]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative max-w-2xl animate-in fade-in slide-in-from-left duration-1000">
            {/* Clean Container for Text */}
            <div className="relative z-10 p-8 lg:p-12 rounded-[2.5rem] bg-white/10 border border-white/20 shadow-2xl overflow-hidden group">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-6 ml-1">
                  <Sparkles size={16} className="text-[var(--primary-green)]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]/60">AI-Powered Nutrition Assistant</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8">
                  Eat Well, <br />
                  <span className="text-[var(--primary-green)] drop-shadow-[0_0_15px_rgba(255,255,255,1)]">Stay Healthy.</span>
                </h1>
                <p className="text-lg text-[var(--text-main)] leading-relaxed mb-10 max-w-lg font-bold opacity-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  NutriAI helps you monitor your daily intake intelligently. Get in-depth analysis and personalized menu recommendations in just seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link
                    to={ctaLink}
                    className="group relative flex items-center justify-center rounded-2xl bg-[var(--primary-green)] px-10 py-5 text-base font-bold text-white shadow-2xl shadow-emerald-500/40 transition-all hover:scale-105 active:scale-100"
                  >
                    {ctaLabel}
                  </Link>
                  <a
                    href="#features"
                    className="flex items-center justify-center rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)]/40 backdrop-blur-sm px-10 py-5 text-base font-bold text-[var(--text-main)] transition-all hover:bg-[var(--bg-card)]/60 shadow-xl"
                  >
                    View Features
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative z-10 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--primary-green)] mb-4">Core Features</h2>
            <p className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">Smart, Fast, <br /> and Measured.</p>
            <p className="text-[var(--text-muted)] text-lg font-medium">Our AI technology is designed to simplify your healthy life.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: ShieldCheck, title: 'Secure Data', desc: 'Your entire food history is stored securely and neatly organized.' },
              { icon: TrendingUp, title: 'Deep Analysis', desc: 'Monitor your nutrition progress charts automatically every day.' },
              { icon: Sparkles, title: 'AI Recommendations', desc: 'Get food advice from Gemini AI based on your body\'s needs.' }
            ].map((f, i) => (
              <div key={i} className="glow-card group p-12 rounded-[2.5rem] bg-[var(--bg-card)] border border-[var(--border-card)] duration-500">
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

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 relative z-10 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--primary-green)]">How it Works</h2>
                <p className="text-4xl lg:text-5xl font-extrabold tracking-tight">Just 3 Steps <br /> to a Healthy Life.</p>
              </div>

              <div className="space-y-10">
                {[
                  { step: '01', title: 'User Story', desc: 'Type what you ate today.' },
                  { step: '02', title: 'AI Analysis', desc: 'Our AI engine will instantly calculate calories, protein, carbs, and fat.' },
                  { step: '03', title: 'Get Recommendations', desc: 'Receive personal advice to maintain your daily nutrition balance.' }
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
              <div className="relative rounded-[3rem] overflow-hidden border border-[var(--border-card)] shadow-2xl">
                <img src="/bg-food.jpg" alt="Health App" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-12">
                  <p className="text-white text-xl font-bold italic">"Health starts with what you eat."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
