import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/useAuth';
import { 
  ArrowLeft, 
  Flame, 
  Dna, 
  Waves, 
  Zap, 
  Info, 
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const NutritionInfoPage = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const nutrients = language === 'id' ? [
    {
      id: 'kcal',
      title: 'Kalori',
      alias: 'KCAL',
      icon: <Flame className="text-orange-500" />,
      color: 'from-orange-500/20 to-rose-500/20',
      borderColor: 'border-orange-500/20',
      description: <>Satuan energi dari makanan dan minuman. Tubuh membutuhkan energi ini untuk segala fungsi, dari <strong>bernapas hingga berolahraga</strong>.</>,
      importance: <>Ini adalah <strong>kunci manajemen berat badan</strong>. Mengonsumsi lebih dari yang dibakar akan menaikkan berat badan, begitu pula sebaliknya.</>,
      sources: ['Semua makanan memiliki kalori', 'Lemak paling padat kalori', 'Karbohidrat & Protein'],
      tips: <>Jangan hanya fokus pada angka! Perhatikan juga <strong>kualitas sumber kalorinya</strong> (Kepadatan Nutrisi).</>
    },
    {
      id: 'prot',
      title: 'Protein',
      alias: 'PROT',
      icon: <Dna className="text-blue-500" />,
      color: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/20',
      description: <><strong>Fondasi tubuh kita.</strong> Sangat penting untuk memperbaiki jaringan, membangun otot, serta memproduksi enzim dan hormon.</>,
      importance: <>Sangat krusial untuk <strong>pemulihan pasca-aktivitas</strong> dan menjaga sistem kekebalan tubuh.</>,
      sources: ['Dada Ayam', 'Telur', 'Tahu & Tempe', 'Ikan', 'Kacang-kacangan'],
      tips: <>Selipkan sumber protein di setiap jam makan agar kamu <strong>merasa kenyang lebih lama</strong>.</>
    },
    {
      id: 'carbs',
      title: 'Karbohidrat',
      alias: 'CARBS',
      icon: <Zap className="text-amber-500" />,
      color: 'from-amber-500/20 to-yellow-500/20',
      borderColor: 'border-amber-500/20',
      description: <>Sumber energi <strong>utama dan tercepat</strong> untuk bahan bakar otak dan otot. Di dalam tubuh, karbohidrat dipecah menjadi glukosa.</>,
      importance: <>Tanpa asupan yang cukup, kamu akan mudah <strong>merasa lesu, lemas, dan kehilangan fokus</strong>.</>,
      sources: ['Nasi Merah', 'Gandum', 'Kentang', 'Buah-buahan', 'Sayuran'],
      tips: <>Pilih <strong>karbohidrat kompleks</strong> (tinggi serat) dibandingkan gula sederhana agar energi tubuh lebih stabil.</>
    },
    {
      id: 'fat',
      title: 'Lemak',
      alias: 'FAT',
      icon: <Waves className="text-emerald-500" />,
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/20',
      description: <>Komponen esensial untuk <strong>menyerap vitamin</strong> (A, D, E, K), melindungi organ tubuh, dan menjaga fungsi otak.</>,
      importance: <>Memberikan <strong>cadangan energi jangka panjang</strong> dan menjaga kesehatan kulit serta rambut.</>,
      sources: ['Alpukat', 'Minyak Zaitun', 'Ikan Berlemak', 'Almond', 'Biji Chia'],
      tips: <>Fokus konsumsi <strong>"Lemak Baik"</strong> (Tak Jenuh) dan batasi Lemak Trans yang biasanya ada pada gorengan.</>
    }
  ] : [
    {
      id: 'kcal',
      title: 'Calories',
      alias: 'KCAL',
      icon: <Flame className="text-orange-500" />,
      color: 'from-orange-500/20 to-rose-500/20',
      borderColor: 'border-orange-500/20',
      description: <>A unit of energy from food and drinks. Your body requires it for all functions, from <strong>breathing to exercising</strong>.</>,
      importance: <>It is the <strong>key to weight management</strong>. Consuming more than you burn leads to weight gain, and vice versa.</>,
      sources: ['All foods contain calories', 'Fat is most calorie-dense', 'Carbs & Protein'],
      tips: <>Don't just fixate on numbers! Always prioritize <strong>the quality of the source</strong> (Nutrient Density).</>
    },
    {
      id: 'prot',
      title: 'Protein',
      alias: 'PROT',
      icon: <Dna className="text-blue-500" />,
      color: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/20',
      description: <><strong>The building blocks of life.</strong> Essential for repairing tissues, building muscle mass, and making vital enzymes.</>,
      importance: <>Crucial for <strong>post-workout recovery</strong> and maintaining a strong immune system.</>,
      sources: ['Chicken Breast', 'Eggs', 'Tofu & Tempeh', 'Fish', 'Nuts'],
      tips: <>Include a protein source in every meal to <strong>stay full for a longer time</strong>.</>
    },
    {
      id: 'carbs',
      title: 'Carbohydrates',
      alias: 'CARBS',
      icon: <Zap className="text-amber-500" />,
      color: 'from-amber-500/20 to-yellow-500/20',
      borderColor: 'border-amber-500/20',
      description: <>The <strong>primary and fastest</strong> source of fuel for your brain and muscles. It breaks down into blood glucose.</>,
      importance: <>Without enough carbs, you will easily <strong>feel sluggish, weak, and lose focus</strong>.</>,
      sources: ['Brown Rice', 'Oats', 'Potatoes', 'Fruits', 'Vegetables'],
      tips: <>Opt for <strong>complex carbs</strong> (high fiber) instead of simple sugars for more stable energy.</>
    },
    {
      id: 'fat',
      title: 'Fats',
      alias: 'FAT',
      icon: <Waves className="text-emerald-500" />,
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/20',
      description: <>Essential components for <strong>absorbing vitamins</strong> (A, D, E, K), protecting organs, and preserving brain function.</>,
      importance: <>Provides <strong>long-term energy reserves</strong> and keeps your skin and hair glowing.</>,
      sources: ['Avocado', 'Olive Oil', 'Fatty Fish', 'Almonds', 'Chia Seeds'],
      tips: <>Focus heavily on <strong>"Good Fats"</strong> (Unsaturated) and limit Trans Fats found in fried foods.</>
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-20 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all mb-8"
          >
            <ArrowLeft size={16} /> {language === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
          </Link>
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--primary-green)]/10 text-[var(--primary-green)] rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <BookOpen size={14} />
            <span>{language === 'id' ? 'Pustaka Nutrisi' : 'Nutrient Library'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-main)] mb-6">
            {language === 'id' ? (
              <>Dasar <span className="text-[var(--primary-green)]">Nutrisi</span></>
            ) : (
              <>Nutrition <span className="text-[var(--primary-green)]">Basics</span></>
            )}
          </h1>
          <p className="text-[var(--text-muted)] font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            {language === 'id' 
              ? 'Memahami istilah dasar adalah langkah awal menuju pola hidup sehat. Berikut adalah panduan singkat tentang metrik nutrisi yang kita lacak:' 
              : 'Understanding basic terms is the first step toward a healthier lifestyle. Here is a quick guide to the nutrition metrics we track:'}
          </p>
        </div>

        {/* Detailed Grid */}
        <div className="grid gap-12">
          {nutrients.map((n) => (
            <div 
              key={n.id} 
              className={`relative overflow-hidden rounded-[3rem] border ${n.borderColor} bg-[var(--bg-card)] p-8 md:p-12 shadow-xl group`}
            >
              {/* Background Accent */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${n.color} blur-[80px] -mr-32 -mt-32 opacity-50 group-hover:opacity-80 transition-opacity`} />
              
              <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-start">
                {/* Left: Icon & Title */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-card)] flex items-center justify-center text-4xl shadow-2xl">
                    {n.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-[var(--text-main)]">{n.title}</h2>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--primary-green)] mt-2">{n.alias}</p>
                  </div>
                </div>

                {/* Right: Detailed Info */}                  <div className="lg:col-span-8 grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[var(--primary-green)]">
                        <Info size={16} />
                        <h3 className="text-xs font-black uppercase tracking-widest">{language === 'id' ? 'Apa itu?' : 'What is it?'}</h3>
                      </div>
                      <p className="text-[var(--text-muted)] font-medium leading-relaxed">{n.description}</p>
                      
                      <div className="pt-6 space-y-4">
                        <div className="flex items-center gap-2 text-blue-500">
                          <CheckCircle2 size={16} />
                          <h3 className="text-xs font-black uppercase tracking-widest">{language === 'id' ? 'Kenapa ini penting' : 'Why it matters'}</h3>
                        </div>
                        <p className="text-[var(--text-muted)] font-medium leading-relaxed italic border-l-2 border-blue-500/20 pl-4">{n.importance}</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 border border-[var(--border-card)]">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-6">{language === 'id' ? 'Sumber Utama' : 'Excellent Sources'}</h3>
                        <div className="flex flex-wrap gap-2">
                          {n.sources.map((source, i) => (
                            <span key={i} className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-xs font-bold text-[var(--text-main)]">
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10">
                        <AlertCircle className="text-amber-500 shrink-0" size={20} />
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">{language === 'id' ? 'Tips Cepat' : 'Quick Tip'}</h4>
                          <p className="text-sm font-bold text-amber-700/80 leading-relaxed">{n.tips}</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-24 p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)] border border-[var(--border-card)] text-center shadow-3xl">
          <h2 className="text-3xl md:text-5xl font-black text-[var(--text-main)] mb-6">{language === 'id' ? 'Siap memantau keseimbangan Anda?' : 'Ready to track your balance?'}</h2>
          <p className="text-[var(--text-muted)] font-medium max-w-xl mx-auto mb-10 text-lg">
            {language === 'id' ? 'Sekarang setelah Anda mengetahui dasarnya, biarkan NutriAI membantu Anda menjaga keseimbangan yang sempurna setiap hari.' : 'Now that you know the basics, let NutriAI help you maintain the perfect balance every day.'}
          </p>
          <Link 
            to={user ? "/dashboard" : "/register"} 
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary-green)] px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-100 transition-all"
          >
            {user 
              ? (language === 'id' ? 'Kembali ke Dashboard' : 'Back to Dashboard')
              : (language === 'id' ? 'Mulai Perjalanan Anda' : 'Start Your Journey')
            }
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NutritionInfoPage;
