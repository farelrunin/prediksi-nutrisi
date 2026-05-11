import React from 'react';
import { Link } from 'react-router-dom';
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
  const nutrients = [
    {
      id: 'kcal',
      title: 'Calories',
      alias: 'KCAL',
      icon: <Flame className="text-orange-500" />,
      color: 'from-orange-500/20 to-rose-500/20',
      borderColor: 'border-orange-500/20',
      description: 'Calories are a measure of the energy content in the food and drinks you consume. Your body needs this energy to function—from breathing to running.',
      importance: 'Energy balance is the key to weight management. If you consume more than you burn, you gain weight, and vice versa.',
      sources: ['All foods contain calories', 'Fat is most calorie-dense', 'Carbs & Protein have less'],
      tips: 'Don\'t just look at the number, look at the quality of the source (Nutrient Density).'
    },
    {
      id: 'prot',
      title: 'Protein',
      alias: 'PROT',
      icon: <Dna className="text-blue-500" />,
      color: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/20',
      description: 'The building blocks of life. Protein is essential for repairing tissues, building muscle, and making enzymes and hormones.',
      importance: 'Essential for recovery after exercise and maintaining immune system health.',
      sources: ['Chicken Breast', 'Eggs', 'Tofu & Tempeh', 'Fish', 'Nuts'],
      tips: 'Try to include a protein source in every meal to keep you full longer.'
    },
    {
      id: 'carbs',
      title: 'Carbohydrates',
      alias: 'CARBS',
      icon: <Zap className="text-amber-500" />,
      color: 'from-amber-500/20 to-yellow-500/20',
      borderColor: 'border-amber-500/20',
      description: 'The primary and fastest source of energy for your brain and muscles. Carbs are broken down into glucose (blood sugar).',
      importance: 'Without enough carbs, you might feel sluggish and lose focus during daily activities.',
      sources: ['Brown Rice', 'Oats', 'Potatoes', 'Fruits', 'Vegetables'],
      tips: 'Choose complex carbs (high fiber) over simple sugars for stable energy.'
    },
    {
      id: 'fat',
      title: 'Fats',
      alias: 'FAT',
      icon: <Waves className="text-emerald-500" />,
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/20',
      description: 'Fats are necessary for absorbing vitamins (A, D, E, K), protecting organs, and maintaining healthy brain function.',
      importance: 'They provide long-term energy and keep your skin and hair healthy.',
      sources: ['Avocado', 'Olive Oil', 'Fatty Fish', 'Almonds', 'Chia Seeds'],
      tips: 'Focus on "Good Fats" (Unsaturated) and limit Trans Fats from fried foods.'
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
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--primary-green)]/10 text-[var(--primary-green)] rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <BookOpen size={14} />
            <span>Nutrient Library</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-main)] mb-6">
            Nutrition <span className="text-[var(--primary-green)]">Basics</span>
          </h1>
          <p className="text-[var(--text-muted)] font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            Understanding the terminology is the first step to a healthier life. 
            Here is everything you need to know about the metrics we track.
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

                {/* Right: Detailed Info */}
                <div className="lg:col-span-8 grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[var(--primary-green)]">
                      <Info size={16} />
                      <h4 className="text-xs font-black uppercase tracking-widest">What is it?</h4>
                    </div>
                    <p className="text-[var(--text-muted)] font-medium leading-relaxed">{n.description}</p>
                    
                    <div className="pt-6 space-y-4">
                      <div className="flex items-center gap-2 text-blue-500">
                        <CheckCircle2 size={16} />
                        <h4 className="text-xs font-black uppercase tracking-widest">Why it matters</h4>
                      </div>
                      <p className="text-[var(--text-muted)] font-medium leading-relaxed italic border-l-2 border-blue-500/20 pl-4">{n.importance}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 border border-[var(--border-card)]">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-6">Excellent Sources</h4>
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
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Quick Tip</h5>
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
          <h2 className="text-3xl md:text-5xl font-black text-[var(--text-main)] mb-6">Ready to track your balance?</h2>
          <p className="text-[var(--text-muted)] font-medium max-w-xl mx-auto mb-10 text-lg">
            Now that you know the basics, let NutriAI help you maintain the perfect balance every day.
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary-green)] px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-100 transition-all"
          >
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NutritionInfoPage;
