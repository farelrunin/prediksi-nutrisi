import React, { useState } from 'react';
import {
  Search, Info, CheckCircle2, XCircle, HeartPulse, Stethoscope, Droplets,
  Activity, Wind, Baby, Thermometer, AlertCircle, Apple, ChevronDown,
  Target, Lightbulb, HelpCircle, BookOpen, AlertTriangle, Share2, Bookmark, ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { getHealthConditions } from '../constants/healthGuides';

const PanduanPage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const healthConditions = getHealthConditions(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const filteredConditions = healthConditions.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to split name and parentheses descriptions in list items for super detailed view
  const parseItem = (str) => {
    const match = str.match(/(.*?)\s*\((.*?)\)/);
    if (match) {
      return { name: match[1].trim(), desc: match[2].trim() };
    }
    return { name: str, desc: '' };
  };

  // Helper to dynamically build target fields matching the reference's look & feel
  const getNutritionalTargetsList = (cond) => {
    if (cond.id === 'anemia') {
      return [
        { label: language === 'id' ? 'Porsi Makan' : 'Meal Portion', value: language === 'id' ? 'Kecil tapi sering' : 'Small but frequent' },
        { label: language === 'id' ? 'Zat Besi Pria' : 'Iron Men', value: '9 mg' },
        { label: language === 'id' ? 'Zat Besi Wanita' : 'Iron Women', value: '18 mg' },
        { label: language === 'id' ? 'Vitamin C' : 'Vitamin C', value: '75 mg' },
        { label: language === 'id' ? 'Kafein Jeda' : 'Caffeine Gap', value: '1 - 2 Jam' }
      ];
    } else if (cond.id === 'asam-urat') {
      return [
        { label: language === 'id' ? 'Purin Harian' : 'Daily Purine', value: '< 150 mg' },
        { label: language === 'id' ? 'Hidrasi Harian' : 'Daily Hydration', value: 'Min. 2 - 3 Liter' },
        { label: language === 'id' ? 'Porsi Makan' : 'Meal Portion', value: language === 'id' ? 'Normal / Seimbang' : 'Normal / Balanced' },
        { label: language === 'id' ? 'Protein Utama' : 'Primary Protein', value: 'Nabati / Low Fat' }
      ];
    } else if (cond.id === 'batu-empedu') {
      return [
        { label: language === 'id' ? 'Porsi Makan' : 'Meal Portion', value: language === 'id' ? 'Kecil tapi sering' : 'Small but frequent' },
        { label: language === 'id' ? 'Tekstur Makanan' : 'Food Texture', value: language === 'id' ? 'Normal / Lunak saat nyeri' : 'Normal / Soft when in pain' },
        { label: language === 'id' ? 'Serat' : 'Fiber Target', value: '30-35 g/hari' },
        { label: language === 'id' ? 'Lemak' : 'Fat Target', value: '30-40 g/hari' },
        { label: language === 'id' ? 'Air Liter' : 'Water Liters', value: '2.5 L' }
      ];
    } else {
      const parts = cond.nutritionalTargets.split(',');
      return parts.map((part, index) => {
        const sub = part.split('(');
        if (sub.length > 1) {
          return { label: sub[1].replace(')', '').trim(), value: sub[0].trim() };
        }
        return { label: language === 'id' ? 'Target' : 'Target', value: part.trim() };
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedCondition.title,
        text: selectedCondition.description,
        url: window.location.href
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(language === 'id' ? 'Tautan panduan disalin ke clipboard!' : 'Guide link copied to clipboard!');
    }
  };

  const handleSave = () => {
    showToast(language === 'id' ? 'Panduan berhasil disimpan ke akun Anda!' : 'Guide successfully saved to your account!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // If a condition is selected, show the rich full-page detail view (feels like a new page)
  if (selectedCondition) {
    const otherConditions = healthConditions.filter(c => c.id !== selectedCondition.id);
    const targetsList = getNutritionalTargetsList(selectedCondition);

    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pt-44 pb-20 px-6 animate-in fade-in duration-500">
        <div className="max-w-5xl mx-auto">

          {/* Animated Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-10 right-6 md:right-10 z-[200] bg-[var(--text-main)] text-[var(--bg-primary)] px-6 py-4 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
              <CheckCircle2 className="text-[var(--primary-green)]" size={16} />
              <span className="uppercase tracking-wider">{toastMessage}</span>
            </div>
          )}

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-8">
            <button
              onClick={() => { setSelectedCondition(null); window.scrollTo(0, 0); }}
              className="hover:text-[var(--primary-green)] transition-colors"
            >
              {language === 'id' ? 'Panduan' : 'Guide'}
            </button>
            <span>/</span>
            <span className="text-[var(--primary-green)]">{selectedCondition.title}</span>
          </div>

          {/* Premium Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 mb-12 pb-6 border-b border-[var(--border-card)]/30">
            <button
              onClick={() => { setSelectedCondition(null); window.scrollTo(0, 0); }}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--primary-green)]/30 transition-all shadow-sm active:scale-95"
            >
              <ArrowLeft size={14} />
              <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] hover:border-[var(--primary-green)]/30 transition-all shadow-sm active:scale-95"
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[var(--primary-green)] text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 hover:shadow-emerald-500/20 hover:shadow-lg transition-all active:scale-95"
              >
                <Bookmark size={14} />
                <span>{language === 'id' ? 'Simpan Panduan' : 'Save Guide'}</span>
              </button>
            </div>
          </div>

          {/* Condition Header Details (Premium Showcase matching the high-fidelity layout!) */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary-green)]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              {/* Title, Alias, Description */}
              <div className="flex-grow space-y-4 max-w-2xl">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-[var(--primary-green)]/10 text-[var(--primary-green)] rounded-full text-[9px] font-black uppercase tracking-wider">{selectedCondition.title}</span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[var(--text-muted)] rounded-full text-[9px] font-black uppercase tracking-wider">{selectedCondition.scientificName}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-[var(--text-main)] tracking-tight leading-tight">
                  {language === 'id' ? `Panduan Nutrisi untuk ${selectedCondition.title}` : `Nutrition Guide for ${selectedCondition.title}`}
                </h1>
                <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed font-medium">
                  {selectedCondition.description}
                </p>
              </div>

              {/* Cover Image */}
              <div className="w-full lg:w-[280px] h-48 lg:h-44 rounded-2xl overflow-hidden border border-[var(--border-card)] shadow-lg relative shrink-0">
                <img
                  src={selectedCondition.image}
                  alt={selectedCondition.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[var(--border-card)]/30 text-left">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Alias / Nama Lain' : 'Scientific Name'}</p>
                <p className="text-xs font-black text-[var(--text-main)] mt-1">{selectedCondition.scientificName}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Rekomendasi Makanan' : 'Recommended Foods'}</p>
                <p className="text-xs font-black text-[var(--text-main)] mt-1">{selectedCondition.recommended.length} Item</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Pantangan' : 'Avoided Foods'}</p>
                <p className="text-xs font-black text-[var(--text-main)] mt-1">{selectedCondition.avoided.length} Item</p>
              </div>
            </div>
          </div>

          {/* Unified Two Columns Responsive Layout (Gejala, Makanan, Tips, Targets) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

            {/* LEFT COLUMN: Main content (Gejala, Makanan, Tips) - Takes 2/3 on Desktop */}
            <div className="lg:col-span-2 space-y-8">

              {/* Gejala & Tanda Grid */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2rem] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="text-orange-500" size={20} />
                  <h3 className="text-base font-black uppercase tracking-widest text-[var(--text-main)]">
                    {language === 'id' ? 'Gejala & Tanda' : 'Symptoms & Signs'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCondition.symptoms.map((symptom, i) => (
                    <div key={i} className="flex items-center gap-4 bg-[var(--bg-secondary)]/50 p-4 rounded-2xl border border-[var(--border-card)]">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-[var(--text-main)]">{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side-by-side Food Lists */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2rem] p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recommended Column */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-card)]/50">
                    <CheckCircle2 className="text-emerald-500" size={18} />
                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">
                      {language === 'id' ? 'Makanan Direkomendasikan' : 'Recommended Foods'}
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {selectedCondition.recommended.map((item, i) => {
                      const parsed = parseItem(item);
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-emerald-500 mt-0.5">▪</span>
                          <div>
                            <span className="font-extrabold text-sm text-[var(--text-main)]">{parsed.name}</span>
                            {parsed.desc && <p className="text-xs font-medium text-[var(--text-muted)] leading-relaxed mt-0.5">{parsed.desc}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Avoided Column */}
                <div className="space-y-6 border-t md:border-t-0 md:border-l border-[var(--border-card)]/50 pt-6 md:pt-0 md:pl-8">
                  <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-card)]/50">
                    <XCircle className="text-rose-500" size={18} />
                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">
                      {language === 'id' ? 'Batasi / Hindari' : 'Avoid / Limit'}
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {selectedCondition.avoided.map((item, i) => {
                      const parsed = parseItem(item);
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-rose-500 mt-0.5">▪</span>
                          <div>
                            <span className="font-extrabold text-sm text-[var(--text-main)]">{parsed.name}</span>
                            {parsed.desc && <p className="text-xs font-medium text-[var(--text-muted)] leading-relaxed mt-0.5">{parsed.desc}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Tips Pengelolaan & Strategi Block */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2rem] p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <Lightbulb className="text-[var(--primary-green)]" size={20} />
                  <h3 className="text-base font-black uppercase tracking-widest text-[var(--text-main)]">
                    {language === 'id' ? 'Tips Pengelolaan & Strategi' : 'Management Tips & Strategies'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[var(--border-card)]/30">
                  {selectedCondition.strategies.map((tip, i) => {
                    const icons = [<Lightbulb size={20} className="text-[var(--primary-green)]" />, <HeartPulse size={20} className="text-[var(--primary-green)]" />, <Apple size={20} className="text-[var(--primary-green)]" />];
                    return (
                      <div key={i} className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--primary-green)]/10 flex items-center justify-center">
                          {icons[i % 3]}
                        </div>
                        <p className="text-xs font-semibold leading-relaxed text-[var(--text-muted)]">{tip}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Sidebar (Target, Aksi Cepat, Referensi) - Takes 1/3 on Desktop */}
            <div className="space-y-8">

              {/* Target Nutrisi Harian Widget */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2rem] p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)] mb-2 flex items-center gap-2">
                  <Target size={14} className="text-[var(--primary-green)]" />
                  <span>{language === 'id' ? 'Target Nutrisi Harian' : 'Daily Nutrition Targets'}</span>
                </h3>
                <div className="space-y-3 pt-3 border-t border-[var(--border-card)]/30">
                  {targetsList.map((target, idx) => (
                    <div key={idx} className="bg-[var(--bg-secondary)]/50 border border-[var(--border-card)] rounded-xl p-3 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{target.label}</p>
                        <p className="text-xs font-black text-[var(--text-main)]">{target.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aksi Cepat Widget */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2rem] p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)] mb-2 flex items-center gap-2">
                  <span>⚡</span> {language === 'id' ? 'Aksi Cepat' : 'Quick Actions'}
                </h3>
                <div className="space-y-3 pt-3 border-t border-[var(--border-card)]/30">
                  <button
                    onClick={() => { setSelectedCondition(null); window.scrollTo(0, 0); }}
                    className="w-full text-left px-5 py-3.5 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-card)] hover:border-[var(--primary-green)]/35 text-xs font-bold text-[var(--text-main)] transition-all flex items-center justify-between"
                  >
                    <span>🔍 {language === 'id' ? ' Sesuai' : 'Find Matching Food'}</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="w-full text-left px-5 py-3.5 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-card)] hover:border-[var(--primary-green)]/35 text-xs font-bold text-[var(--text-main)] transition-all flex items-center justify-between"
                  >
                    <span>📋 {language === 'id' ? 'Program Diri' : 'Self Program'}</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="w-full py-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-card)] hover:bg-[var(--primary-green)] hover:text-white hover:border-transparent text-xs font-black uppercase tracking-wider text-[var(--text-muted)] transition-all"
                  >
                    {language === 'id' ? 'Simpan Panduan' : 'Save Guide'}
                  </button>
                </div>
              </div>

              {/* Referensi & Validasi Widget */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2rem] p-6 shadow-sm space-y-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)] flex items-center gap-2">
                  <BookOpen size={14} className="text-[var(--text-muted)]" />
                  <span>{language === 'id' ? 'Referensi & Validasi' : 'References & Validation'}</span>
                </h3>
                <div className="space-y-4 pt-3 border-t border-[var(--border-card)]/30">
                  <div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-wider">✓ Data Terverifikasi</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Terakhir Diperbarui' : 'Last Updated'}</p>
                    <p className="text-xs font-extrabold text-[var(--text-main)] mt-0.5">19 Mei 2026</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Sumber Data' : 'Data Sources'}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {selectedCondition.references.map((ref, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-[var(--bg-secondary)] border border-[var(--border-card)] rounded-lg text-[9px] font-extrabold text-[var(--text-main)]">{ref}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Diverifikasi Oleh' : 'Verified By'}</p>
                    <p className="text-xs font-black text-[var(--primary-green)] uppercase tracking-wider mt-0.5">Tim NutriNusa</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Collapsible FAQ Accordion */}
          <div className="space-y-6 mb-16 pt-8 border-t border-[var(--border-card)]/30">
            <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)]">
              {language === 'id' ? 'Pertanyaan Umum' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-3">
              {selectedCondition.faq.map((item, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div key={i} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-card)] overflow-hidden shadow-sm transition-all duration-300">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full p-6 text-left flex justify-between items-center font-extrabold text-[var(--text-main)] text-sm hover:text-[var(--primary-green)] transition-colors"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--primary-green)]' : 'text-[var(--text-muted)]'}`} size={16} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 border-t border-[var(--border-card)]/30 animate-in fade-in duration-300">
                        <p className="text-xs font-semibold leading-relaxed text-[var(--text-muted)]">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explore Other Conditions (Interactive footer cards with image backgrounds!) */}
          <div className="space-y-6 pt-8 border-t border-[var(--border-card)]/30">
            <h3 className="text-base font-black uppercase tracking-widest text-[var(--text-main)]">{language === 'id' ? 'Jelajahi Kondisi Kesehatan Lainnya' : 'Explore Other Health Conditions'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherConditions.slice(0, 3).map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => { setSelectedCondition(condition); setOpenFaqIndex(null); window.scrollTo(0, 0); }}
                  className="group text-left bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2rem] overflow-hidden hover:border-[var(--primary-green)]/35 hover:scale-[1.02] transition-all flex flex-col shadow-sm h-full"
                >
                  <div className="h-28 w-full overflow-hidden relative shrink-0">
                    <img
                      src={condition.image}
                      alt={condition.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 w-8 h-8 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg text-[var(--primary-green)]">
                      {React.cloneElement(condition.icon, { size: 14 })}
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-center">
                    <h4 className="font-extrabold text-[var(--text-main)] group-hover:text-[var(--primary-green)] transition-colors text-sm line-clamp-1">{condition.title}</h4>
                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider line-clamp-1 mt-0.5">{condition.scientificName}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- STANDARD SELECTION LIST VIEW ---
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-44 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--primary-green)]/10 text-[var(--primary-green)] rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <BookOpen size={14} />
            <span>{language === 'id' ? 'Basis Pengetahuan Kesehatan' : 'Health Knowledge Base'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-main)] mb-6">
            {language === 'id' ? 'Panduan' : 'Nutrition'} <span className="text-[var(--primary-green)]">{language === 'id' ? 'Nutrisi' : 'Guide'}</span>
          </h1>
          <p className="text-[var(--text-muted)] font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            {language === 'id' ? 'Pusat Edukasi Kesehatan NutriAI. Pelajari kondisi tubuh Anda dan temukan strategi nutrisi terbaik untuk kualitas hidup yang lebih sehat.' : "NutriAI Health Education Center. Learn about your body's condition and find the best nutritional strategies for a healthier quality of life."}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 relative group">
          <div className="absolute inset-0 bg-[var(--primary-green)]/10 blur-xl group-focus-within:bg-[var(--primary-green)]/20 transition-all rounded-full" />
          <div className="relative flex items-center bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl px-8 py-5 shadow-2xl">
            <Search className="text-[var(--primary-green)] mr-4" size={24} />
            <input
              type="text"
              placeholder={language === 'id' ? 'Cari kondisi kesehatan' : 'Search health conditions'}
              className="bg-transparent w-full outline-none text-[var(--text-main)] font-bold text-lg placeholder-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 text-center text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            {language === 'id' ? `Menampilkan ${filteredConditions.length} Panduan Medis Valid` : `Displaying ${filteredConditions.length} Valid Medical Guides`}
          </div>
        </div>

        {/* Grid Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredConditions.map((condition) => (
            <button
              key={condition.id}
              aria-label={`${language === 'id' ? 'Lihat panduan' : 'View guide for'} ${condition.title}`}
              onClick={() => {
                setSelectedCondition(condition);
                setOpenFaqIndex(null);
                window.scrollTo(0, 0);
              }}
              className="group text-left bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] overflow-hidden transition-all hover:scale-[1.02] hover:border-[var(--primary-green)]/30 hover:shadow-2xl hover:shadow-[var(--primary-green)]/10 flex flex-col h-full"
            >
              {/* Card Image Header with Icon Overlay */}
              <div className="relative h-52 w-full overflow-hidden shrink-0">
                <img
                  src={condition.image}
                  alt={condition.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {/* Floating Icon Badge */}
                <div className="absolute bottom-4 left-6 w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg text-[var(--primary-green)]">
                  {React.cloneElement(condition.icon, { size: 20 })}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-black text-[var(--text-main)] mb-1 group-hover:text-[var(--primary-green)] transition-colors line-clamp-1">
                    {condition.title}
                  </h3>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 line-clamp-1">
                    {condition.scientificName}
                  </p>
                  <p className="text-[var(--text-muted)] text-xs leading-relaxed font-medium mb-6 line-clamp-2">
                    {condition.description}
                  </p>
                </div>

                {/* Card Pills & Link Button */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-card)]/30 mt-auto shrink-0">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-emerald-500">
                      🟢 {condition.recommended.length} {language === 'id' ? 'direkomendasikan' : 'recommended'}
                    </span>
                    <span className="flex items-center gap-1 text-rose-500">
                      🔴 {condition.avoided.length} {language === 'id' ? 'dihindari' : 'avoided'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-card)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[var(--primary-green)] group-hover:text-white transition-all duration-300">
                    <span className="text-sm font-black">→</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PanduanPage;
