  Target, Lightbulb, HelpCircle, BookOpen, AlertTriangle 
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

  const filteredConditions = healthConditions.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-6">
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
              onClick={() => {
                setSelectedCondition(condition);
                setActiveTab('nutrisi');
              }}
              className="group text-left bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-8 transition-all hover:scale-[1.02] hover:border-[var(--primary-green)]/30 hover:shadow-2xl hover:shadow-[var(--primary-green)]/10"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {condition.icon}
                </div>
                <div className="bg-[var(--primary-green)]/10 text-[var(--primary-green)] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {language === 'id' ? 'Detail Medis' : 'Medical Detail'}
                </div>
              </div>
              <h3 className="text-2xl font-black text-[var(--text-main)] mb-2 group-hover:text-[var(--primary-green)] transition-colors">
                {condition.title}
              </h3>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6">
                {condition.scientificName}
              </p>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium line-clamp-3">
                {condition.description}
              </p>
            </button>
          ))}
        </div>

        {/* Modal Detail - Super Rich Content */}
        {selectedCondition && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
            <div 
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedCondition(null)}
            />
            <div className="relative bg-[var(--bg-card)] border border-[var(--border-card)] w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
              
              {/* Modal Header */}
              <div className="p-8 md:p-10 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)] border-b border-[var(--border-card)] shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-[var(--bg-primary)] flex items-center justify-center text-4xl shadow-2xl">
                      {selectedCondition.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-[var(--text-main)]">{selectedCondition.title}</h2>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--primary-green)] mt-1">{selectedCondition.scientificName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCondition(null)}
                    className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-red-500 transition-colors"
                  >
                    <ChevronDown className="rotate-180 md:rotate-0" size={24} />
                  </button>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex bg-[var(--bg-primary)] border-b border-[var(--border-card)] px-4">
                {[
                  { id: 'nutrisi', label: language === 'id' ? 'Nutrisi & Strategi' : 'Nutrition & Strategy', icon: <Apple size={14} /> },
                  { id: 'gejala', label: language === 'id' ? 'Gejala & Target' : 'Symptoms & Target', icon: <Activity size={14} /> },
                  { id: 'faq', label: language === 'id' ? 'FAQ & Edukasi' : 'FAQ & Education', icon: <HelpCircle size={14} /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                      activeTab === tab.id ? 'text-[var(--primary-green)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--primary-green)] rounded-t-full shadow-[0_0_10px_var(--primary-green)]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Modal Content Scrollable */}
              <div className="p-8 md:p-12 overflow-y-auto space-y-12 bg-[var(--bg-card)]">
                
                {activeTab === 'nutrisi' && (
                  <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Food Lists */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[var(--primary-green)]/10 text-[var(--primary-green)]"><CheckCircle2 size={18} /></div>
                          <h4 className="text-sm font-black uppercase tracking-widest">{language === 'id' ? 'Sangat Direkomendasikan' : 'Highly Recommended'}</h4>
                        </div>
                        <div className="space-y-3">
                          {selectedCondition.recommended.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 bg-[var(--bg-primary)]/50 p-4 rounded-2xl border border-[var(--border-card)] hover:border-[var(--primary-green)]/30 transition-all">
                              <span className="font-bold text-[var(--text-main)] text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-red-500/10 text-red-500"><XCircle size={18} /></div>
                          <h4 className="text-sm font-black uppercase tracking-widest">{language === 'id' ? 'Wajib Dihindari' : 'Must Avoid'}</h4>
                        </div>
                        <div className="space-y-3">
                          {selectedCondition.avoided.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 bg-[var(--bg-primary)]/50 p-4 rounded-2xl border border-red-500/10 hover:border-red-500/30 transition-all">
                              <span className="font-bold text-[var(--text-main)] text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Strategies */}
                    <div className="rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-card)] p-8">
                      <div className="flex items-center gap-3 mb-8">
                        <Lightbulb className="text-[var(--primary-green)]" size={20} />
                        <h4 className="text-sm font-black uppercase tracking-widest">{language === 'id' ? 'Tips & Strategi Pengelolaan' : 'Management Tips & Strategies'}</h4>
                      </div>
                      <div className="grid gap-4">
                        {selectedCondition.strategies.map((tip, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--primary-green)] shrink-0" />
                            <p className="text-sm font-medium leading-relaxed text-[var(--text-main)]">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'gejala' && (
                  <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Symptoms */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="text-orange-500" size={20} />
                        <h4 className="text-sm font-black uppercase tracking-widest">{language === 'id' ? 'Gejala & Tanda Umum' : 'Common Symptoms & Signs'}</h4>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {selectedCondition.symptoms.map((symptom, i) => (
                          <span key={i} className="px-5 py-3 bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl text-xs font-bold text-[var(--text-main)]">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Targets */}
                    <div className="rounded-3xl bg-gradient-to-r from-[var(--primary-green)]/10 to-[var(--accent-blue)]/10 border border-[var(--primary-green)]/20 p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <Target className="text-[var(--primary-green)]" size={20} />
                        <h4 className="text-sm font-black uppercase tracking-widest">{language === 'id' ? 'Target Nutrisi Harian' : 'Daily Nutritional Target'}</h4>
                      </div>
                      <p className="text-lg font-bold text-[var(--text-main)] leading-relaxed">
                        {selectedCondition.nutritionalTargets}
                      </p>
                    </div>

                    {/* References */}
                    <div className="space-y-4 pt-12 border-t border-[var(--border-card)]">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="text-[var(--text-muted)]" size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Referensi Medis & Validasi' : 'Medical References & Validation'}</h4>
                      </div>
                      <div className="flex flex-wrap gap-6">
                        {selectedCondition.references.map((ref, i) => (
                          <span key={i} className="text-xs font-black text-[var(--text-muted)] uppercase tracking-tight">{ref}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {selectedCondition.faq.map((item, i) => (
                      <div key={i} className="bg-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-card)] overflow-hidden">
                        <div className="p-6 bg-[var(--bg-secondary)] border-b border-[var(--border-card)] flex items-start gap-4">
                          <HelpCircle className="text-[var(--primary-green)] mt-1 shrink-0" size={18} />
                          <h5 className="font-black text-[var(--text-main)]">{item.q}</h5>
                        </div>
                        <div className="p-8">
                          <p className="text-sm font-medium leading-relaxed text-[var(--text-muted)]">{item.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button Footer */}
              <div className="p-8 border-t border-[var(--border-card)] bg-[var(--bg-secondary)] flex justify-center shrink-0">
                <button 
                  onClick={() => setSelectedCondition(null)}
                  className="bg-[var(--text-main)] text-[var(--bg-primary)] px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform shadow-2xl active:scale-95"
                >
                  {language === 'id' ? 'Selesai Membaca' : 'Done Reading'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanduanPage;
