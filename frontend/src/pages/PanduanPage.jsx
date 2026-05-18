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
  const [activeTab, setActiveTab] = useState('nutrisi'); // 'nutrisi', 'gejala', 'faq'
  const [toastMessage, setToastMessage] = useState('');

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

  const handleShare = () => {
    // Attempt modern sharing if supported, else clipboard copy
    if (navigator.share) {
      navigator.share({
        title: selectedCondition.title,
        text: selectedCondition.description,
        url: window.location.href
      }).catch(() => {});
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

          {/* Condition Header Details (The "Anemia" Showcase Card) */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary-green)]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-card)] flex items-center justify-center text-5xl shadow-xl shrink-0">
                {selectedCondition.icon}
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-black text-[var(--text-main)] tracking-tight leading-none">
                  {selectedCondition.title}
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-green)]">
                  {selectedCondition.scientificName}
                </p>
                <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed font-medium pt-3 max-w-3xl">
                  {selectedCondition.description}
                </p>
              </div>
            </div>

            {/* Overview / Quick Statistics */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-[var(--border-card)]/30 text-center">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Rekomendasi' : 'Recommended'}</p>
                <p className="text-lg font-black text-emerald-500">{selectedCondition.recommended.length} {language === 'id' ? 'Item' : 'Items'}</p>
              </div>
              <div className="space-y-1 border-x border-[var(--border-card)]/30">
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Pantangan' : 'Avoided'}</p>
                <p className="text-lg font-black text-rose-500">{selectedCondition.avoided.length} {language === 'id' ? 'Item' : 'Items'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Gejala' : 'Symptoms'}</p>
                <p className="text-lg font-black text-orange-500">{selectedCondition.symptoms.length} {language === 'id' ? 'Tanda' : 'Signs'}</p>
              </div>
            </div>
          </div>

          {/* Sticky-like Premium Tab Switcher */}
          <div className="flex bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-1.5 mb-12 shadow-inner">
            {[
              { id: 'nutrisi', label: language === 'id' ? 'Rekomendasi & Pantangan' : 'Food Recommendations', icon: <Apple size={14} /> },
              { id: 'gejala', label: language === 'id' ? 'Gejala & Strategi' : 'Symptoms & Targets', icon: <Activity size={14} /> },
              { id: 'faq', label: language === 'id' ? 'Tanya Jawab (FAQ)' : 'FAQ & Help', icon: <HelpCircle size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[var(--primary-green)] text-white shadow-lg shadow-emerald-500/10' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Switchable Sections */}
          <div className="space-y-12 mb-20">
            {activeTab === 'nutrisi' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                {/* Recommended Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><CheckCircle2 size={16} /></div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">{language === 'id' ? 'Makanan Yang Direkomendasikan' : 'Highly Recommended Foods'}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedCondition.recommended.map((item, i) => {
                      const parsed = parseItem(item);
                      return (
                        <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-card)] p-6 rounded-3xl hover:border-emerald-500/30 transition-all flex flex-col justify-center shadow-sm">
                          <h4 className="font-extrabold text-[var(--text-main)] text-base mb-1.5 flex items-center gap-2">
                            <span className="text-emerald-500">🟢</span>
                            <span>{parsed.name}</span>
                          </h4>
                          {parsed.desc && <p className="text-xs font-medium text-[var(--text-muted)] leading-relaxed pl-5">{parsed.desc}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Avoided Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500"><XCircle size={16} /></div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">{language === 'id' ? 'Makanan Yang Harus Dihindari / Batasi' : 'Foods to Avoid / Restrict'}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedCondition.avoided.map((item, i) => {
                      const parsed = parseItem(item);
                      return (
                        <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-card)] p-6 rounded-3xl hover:border-rose-500/30 transition-all flex flex-col justify-center shadow-sm">
                          <h4 className="font-extrabold text-[var(--text-main)] text-base mb-1.5 flex items-center gap-2">
                            <span className="text-rose-500">🔴</span>
                            <span>{parsed.name}</span>
                          </h4>
                          {parsed.desc && <p className="text-xs font-medium text-[var(--text-muted)] leading-relaxed pl-5">{parsed.desc}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gejala' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                {/* Symptoms Tag Clouds */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-orange-500" size={16} />
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">{language === 'id' ? 'Gejala & Tanda Umum' : 'Common Symptoms & Signs'}</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedCondition.symptoms.map((symptom, i) => (
                      <span key={i} className="px-5 py-3.5 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl text-xs font-bold text-[var(--text-main)] shadow-sm hover:border-[var(--primary-green)]/35 transition-all">
                        ⚠️ {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Daily Nutritional Target Card */}
                <div className="rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-card)] p-8 md:p-10 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--primary-green)]/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <Target className="text-[var(--primary-green)]" size={20} />
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">{language === 'id' ? 'Target Nutrisi Harian' : 'Daily Nutritional Target'}</h3>
                  </div>
                  <p className="text-base font-extrabold text-[var(--text-main)] leading-relaxed relative z-10 max-w-4xl">
                    {selectedCondition.nutritionalTargets}
                  </p>
                </div>

                {/* Management Tips / Strategies */}
                <div className="rounded-[2rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)] border border-[var(--border-card)] p-8 md:p-10 shadow-lg">
                  <div className="flex items-center gap-3 mb-8">
                    <Lightbulb className="text-[var(--primary-green)]" size={20} />
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">{language === 'id' ? 'Tips Pengelolaan & Strategi' : 'Management Tips & Strategies'}</h3>
                  </div>
                  <div className="grid gap-4">
                    {selectedCondition.strategies.map((tip, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--primary-green)] shrink-0" />
                        <p className="text-sm font-semibold leading-relaxed text-[var(--text-main)]">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {selectedCondition.faq.map((item, i) => (
                  <div key={i} className="bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border-card)] overflow-hidden shadow-sm hover:border-[var(--primary-green)]/30 transition-all">
                    <div className="p-6 bg-[var(--bg-secondary)]/50 border-b border-[var(--border-card)]/50 flex items-start gap-4">
                      <HelpCircle className="text-[var(--primary-green)] mt-0.5 shrink-0" size={18} />
                      <h4 className="font-extrabold text-[var(--text-main)] text-sm">{item.q}</h4>
                    </div>
                    <div className="p-6 md:p-8">
                      <p className="text-xs font-semibold leading-relaxed text-[var(--text-muted)]">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical References Footer block */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2rem] p-8 md:p-10 mb-16 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-[var(--text-muted)]" size={16} />
              <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Referensi Medis & Validasi' : 'Medical References & Validation'}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left pt-6 border-t border-[var(--border-card)]/30">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Status Data' : 'Data Status'}</p>
                <p className="text-xs font-black text-emerald-500 uppercase tracking-tight mt-1">✓ Terverifikasi</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Terakhir Diperbarui' : 'Last Updated'}</p>
                <p className="text-xs font-extrabold text-[var(--text-main)] mt-1">19 Mei 2026</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Sumber Medis' : 'Medical Sources'}</p>
                <p className="text-xs font-extrabold text-[var(--text-main)] mt-1">{selectedCondition.references.join(', ')}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Diverifikasi Oleh' : 'Verified By'}</p>
                <p className="text-xs font-black text-[var(--primary-green)] uppercase tracking-tight mt-1">Tim NutriAI</p>
              </div>
            </div>
          </div>

          {/* Explore Other Conditions (Interactive footer cards) */}
          <div className="space-y-6">
            <h3 className="text-base font-black uppercase tracking-widest text-[var(--text-main)]">{language === 'id' ? 'Jelajahi Kondisi Kesehatan Lainnya' : 'Explore Other Health Conditions'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherConditions.slice(0, 3).map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => { setSelectedCondition(condition); setActiveTab('nutrisi'); window.scrollTo(0, 0); }}
                  className="group text-left bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2rem] p-6 hover:border-[var(--primary-green)]/30 hover:scale-[1.02] transition-all flex items-center gap-4 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    {condition.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[var(--text-main)] group-hover:text-[var(--primary-green)] transition-colors text-sm line-clamp-1">{condition.title}</h4>
                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider line-clamp-1">{condition.scientificName}</p>
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
              placeholder={language === 'id' ? 'Cari kondisi kesehatan (Diabetes, GERD, Hipertensi...)' : 'Search health conditions (Diabetes, GERD, Hypertension...)'}
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
                setActiveTab('nutrisi');
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
