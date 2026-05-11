import React, { useState } from 'react';
import { 
  Search, Info, CheckCircle2, XCircle, HeartPulse, Stethoscope, Droplets, 
  Activity, Wind, Baby, Thermometer, AlertCircle, Apple, ChevronDown, 
  Target, Lightbulb, HelpCircle, BookOpen, AlertTriangle 
} from 'lucide-react';

const healthConditions = [
  {
    id: 'diabetes',
    title: 'Diabetes',
    scientificName: 'Diabetes Mellitus',
    icon: <Droplets className="text-orange-500" />,
    description: 'A chronic metabolic disease characterized by high blood sugar due to failure in insulin production or effective use.',
    symptoms: ['Frequent thirst (polydipsia)', 'Frequent urination, especially at night', 'Blurred vision', 'Slow-healing wounds', 'Drastic unexplained weight loss'],
    recommended: ['Leafy green vegetables', 'Brown rice/Shirataki', 'Salmon/Tuna', 'Nuts and seeds', 'Unsweetened yogurt', 'Low GI fruits (Apple/Pear)'],
    avoided: ['Sugar & syrups', 'Large portions of white rice', 'Flour-based foods', 'Sweet packaged drinks', 'Canned fruits'],
    nutritionalTargets: 'Complex Carbohydrates (45-65% calories), High Fiber (>25g/day), Limit Simple Sugars (<5% total calories).',
    strategies: [
      'Use the "T-Plate" method (1/2 vegetables, 1/4 carbs, 1/4 protein).',
      'Eat small but frequent portions (every 3-4 hours) to maintain sugar stability.',
      'Avoid heavy meals 2 hours before bedtime.',
      'Choose steaming or boiling methods instead of frying.'
    ],
    faq: [
      { q: 'Can diabetics eat white rice?', a: 'Yes, but in strictly limited portions (about 1-2 scoops) and preferably accompanied by high fiber to slow down sugar absorption.' },
      { q: 'Are sweet fruits totally forbidden?', a: 'No, fruits like apples or pears can still be eaten with their skin because they contain high fiber.' }
    ],
    references: ['PERKENI', 'American Diabetes Association (ADA)', 'Ministry of Health RI']
  },
  {
    id: 'hipertensi',
    title: 'Hypertension',
    scientificName: 'High Blood Pressure',
    icon: <HeartPulse className="text-red-600" />,
    description: 'A chronic condition where the arterial blood pressure is persistently elevated (>130/80 mmHg).',
    symptoms: ['Severe headache', 'Fatigue or confusion', 'Vision problems', 'Chest pain', 'Irregular heartbeat'],
    recommended: ['Green vegetables (Spinach/Broccoli)', 'Berries (Strawberry/Blueberry)', 'Low-fat yogurt', 'Oatmeal', 'Bananas (Rich in Potassium)', 'Garlic'],
    avoided: ['Excessive salt', 'Processed meats (Sausage/Ham)', 'Salty pickles', 'Instant noodles', 'Chicken skin & saturated fats'],
    nutritionalTargets: 'DASH Diet (Dietary Approaches to Stop Hypertension), Sodium < 2000mg/day (equivalent to 1 tsp salt).',
    strategies: [
      'Use natural spices instead of salt (lime, pepper).',
      'Always check nutrition labels on packaging (choose low sodium).',
      'Increase potassium intake from fruit to help flush out excess salt.'
    ],
    faq: [
      { q: 'Why does salt cause high blood pressure?', a: 'Salt binds water in the blood vessels, increasing blood volume which makes the heart work harder.' },
      { q: 'Is coffee allowed for hypertension?', a: 'Caffeine can temporarily increase blood pressure; limit to 1-2 cups a day.' }
    ],
    references: ['Indonesian Society of Hypertension (PERHI)', 'AHA (American Heart Association)']
  },
  {
    id: 'gerd',
    title: 'GERD',
    scientificName: 'Acid Reflux',
    icon: <Wind className="text-emerald-500" />,
    description: 'A condition where stomach contents flow back into the esophagus, causing a burning sensation (heartburn).',
    symptoms: ['Burning sensation in the chest (heartburn)', 'Acid taste in the mouth', 'Hoarseness', 'Chronic dry cough', 'Difficulty swallowing'],
    recommended: ['Ginger (anti-inflammatory)', 'Oatmeal', 'Bananas & Melons', 'Egg whites', 'Lean meat (boiled)', 'Aloe vera'],
    avoided: ['Chocolate & Mint', 'Spicy & acidic foods', 'Fried/high-fat foods', 'Coffee & Alcohol', 'Carbonated drinks'],
    nutritionalTargets: 'Focus on Alkaline (Neutral) pH foods, lean protein, and small portions.',
    strategies: [
      'Do not lie down immediately after eating (wait at least 3 hours).',
      'Eat slowly and chew thoroughly.',
      'Avoid tight clothing in the abdominal area while eating.'
    ],
    faq: [
      { q: 'Can I drink warm water during a flare-up?', a: 'Warm water helps soothe, but avoid mixing it with lemon or orange.' },
      { q: 'Why is chocolate prohibited?', a: 'Chocolate contains methylxanthine which relaxes the lower esophageal valve, allowing acid to rise easily.' }
    ],
    references: ['PGI (Indonesian Gastroenterology Association)', 'Mayo Clinic']
  },
  {
    id: 'asam-urat',
    title: 'Gout',
    scientificName: 'Gouty Arthritis (Hyperuricemia)',
    icon: <HeartPulse className="text-purple-500" />,
    description: 'A painful inflammatory arthritis caused by the buildup of monosodium urate crystals in the joints.',
    symptoms: ['Sudden and severe joint pain', 'Swollen and red joints', 'Heat sensation in the joint area', 'Joint stiffness in the morning'],
    recommended: ['Water (min. 2L/day)', 'Cherries & berries', 'Green vegetables (non-spinach)', 'Low-fat milk', 'Complex carbohydrates'],
    avoided: ['Organ meats (liver, kidney)', 'Red meat (lamb/beef)', 'Seafood (shrimp, shellfish)', 'Sweet drinks/fructose', 'Melinjo chips'],
    nutritionalTargets: 'Low Purine Diet (<150mg purine/day), high hydration to flush out urate crystals.',
    strategies: [
      'Drink a glass of water every 2 hours.',
      'Choose protein sources from plants (tempeh/tofu) or low-fat milk.',
      'Avoid using thick meat broth in cooking.'
    ],
    faq: [
      { q: 'Can gout sufferers eat water spinach?', a: 'Yes, but in moderate portions because water spinach contains moderate purines.' },
      { q: 'Why are cherries good for gout?', a: 'Cherries contain anthocyanins which are anti-inflammatory and help lower uric acid levels.' }
    ],
    references: ['IRA (Indonesian Rheumatology Association)', 'Arthritis Foundation']
  },
  {
    id: 'batu-empedu',
    title: 'Gallstones',
    scientificName: 'Cholelithiasis',
    icon: <Activity className="text-yellow-600" />,
    description: 'Hardened deposits of digestive fluid that can form in your gallbladder.',
    symptoms: ['Severe pain in the upper right abdomen', 'Nausea and vomiting after eating fatty meals', 'Back pain between the shoulder blades', 'Pain in the right shoulder'],
    recommended: ['High fiber foods (Wheat/Oat)', 'Fresh fruits & vegetables', 'Whole grains', 'Salmon', 'Olive Oil'],
    avoided: ['Fried & saturated fats', 'Fatty meats', 'Full cream milk', 'Butter/Margarine', 'Excessive egg yolks'],
    nutritionalTargets: 'Low Fat Diet (<30% total calories), High Soluble Fiber (>20g/day).',
    strategies: [
      'Use boiling, steaming, or grilling cooking methods.',
      'Reduce animal cholesterol intake.',
      'Do not skip breakfast to prevent thickening of bile.'
    ],
    faq: [
      { q: 'Is Keto diet okay for gallstones?', a: 'Highly not recommended, because high fat can trigger biliary colic (pain attacks).' },
      { q: 'Does coffee help?', a: 'Some studies show coffee can stimulate gallbladder contractions, but consult your doctor first.' }
    ],
    references: ['PGI', 'Mayo Clinic']
  },
  {
    id: 'batu-ginjal',
    title: 'Kidney Stones',
    scientificName: 'Nephrolitiasis',
    icon: <Stethoscope className="text-blue-600" />,
    description: 'Hard deposits made of minerals and salts that form inside your kidneys.',
    symptoms: ['Sharp pain in the side or back', 'Pain during urination', 'Cloudy or reddish urine', 'Nausea and vomiting'],
    recommended: ['Water (Crucial)', 'Lemon/Citrus', 'Calcium from natural foods', 'High water content fruits'],
    avoided: ['High salt (sodium)', 'Spinach & Beets (High oxalate)', 'Peanuts', 'Strong tea', 'Excessive animal protein'],
    nutritionalTargets: 'Urine hydration > 2.5 liters per day, Limit Oxalate and Sodium.',
    strategies: [
      'Ensure urine is clear light yellow as a sign of sufficient hydration.',
      'Reduce consumption of red meat which can increase uric acid in the kidneys.',
      'Consume calcium foods along with oxalate foods to bind them in the gut (not in the kidneys).'
    ],
    faq: [
      { q: 'Why is lemon good for kidney stones?', a: 'Lemon contains citrate which prevents the formation of calcium crystals into stones.' },
      { q: 'Is water alone enough?', a: 'Yes, water is the number one treatment and prevention.' }
    ],
    references: ['IAUI (Indonesian Urological Association)', 'National Kidney Foundation']
  },
  {
    id: 'chronic-kidney-disease',
    title: 'Chronic Kidney Disease',
    scientificName: 'CKD',
    icon: <Activity className="text-blue-800" />,
    description: 'A gradual loss of kidney function over time, affecting the body\'s ability to filter waste from the blood.',
    symptoms: ['Swelling in hands/feet (edema)', 'Shortness of breath', 'Chronic itching', 'Foamy urine', 'Decreased appetite'],
    recommended: ['Egg whites (clean protein)', 'Cauliflower', 'Blueberries', 'Garlic', 'White bread/Pasta (Low phosphorus)'],
    avoided: ['Table salt', 'Bananas & Avocados (High potassium)', 'Dairy products (High phosphorus)', 'Processed meats', 'Whole wheat bread'],
    nutritionalTargets: 'Limit Protein (0.6-0.8g/kg body weight), Low Potassium (<2000mg), Low Phosphorus.',
    strategies: [
      'Soak vegetables in warm water before cooking to reduce potassium levels.',
      'Use natural seasonings (sour, garlic) instead of salt.',
      'Strictly monitor fluid intake as advised by your doctor.'
    ],
    faq: [
      { q: 'Why are bananas prohibited?', a: 'Damaged kidneys have difficulty removing excess potassium from bananas, which can be dangerous for heart rhythm.' },
      { q: 'Can I eat rice?', a: 'Yes, white rice is better than whole grains because its phosphorus content is lower.' }
    ],
    references: ['PERNEFRI (Indonesian Nephrology Association)', 'NKF']
  },
  {
    id: 'hipotensi',
    title: 'Hypotension',
    scientificName: 'Low Blood Pressure',
    icon: <Droplets className="text-pink-400" />,
    description: 'A condition where blood pressure is below normal (90/60 mmHg), which can cause dizziness or fainting.',
    symptoms: ['Dizziness or lightheadedness', 'Blurred vision', 'Nausea', 'Fainting (syncope)', 'Lack of concentration'],
    recommended: ['Salty foods (in moderation)', 'Mineral water (electrolytes)', 'Eggs & Red meat', 'Morning Coffee/Tea', 'Nuts and seeds'],
    avoided: ['Alcohol (dehydrating)', 'Skipping meals', 'Diet too low in salt'],
    nutritionalTargets: 'Increase Sodium (salt) measurably, high hydration to increase blood volume.',
    strategies: [
      'Eat in small but frequent portions rather than one large meal.',
      'Increase mineral water intake to at least 2.5 - 3 liters a day.',
      'Use compression stockings if necessary.'
    ],
    faq: [
      { q: 'Can I eat a lot of salt?', a: 'Yes, but still within reasonable limits and choose quality salt.' },
      { q: 'Why are small meal portions better?', a: 'Large meals can trigger a drop in blood pressure after eating (postprandial hypotension).' }
    ],
    references: ['Ministry of Health RI', 'American Heart Association']
  },
  {
    id: 'bumil',
    title: 'Pregnancy',
    scientificName: 'Maternal Health',
    icon: <Baby className="text-pink-500" />,
    description: 'Pregnancy requires specific nutrients to support fetal growth and maternal health.',
    symptoms: ['Morning sickness', 'Fatigue', 'Frequent urination', 'Appetite changes', 'Abdominal cramps'],
    recommended: ['Green vegetables (Folic Acid)', 'Fully cooked meat', 'Low-mercury fish', 'Eggs & prenatal milk', 'Nuts and seeds'],
    avoided: ['Sushi/Raw meat', 'Unpasteurized milk', 'High-mercury fish (Shark/King Mackerel)', 'Excessive caffeine', 'Alcohol'],
    nutritionalTargets: 'Extra calories (+300-500 kcal), Iron (27mg), Folic Acid (600mcg).',
    strategies: [
      'Ensure all animal foods are cooked thoroughly.',
      'Thoroughly wash all raw vegetables and fruits.',
      'Drink at least 10-12 glasses of water a day.'
    ],
    faq: [
      { q: 'Can I eat durian?', a: 'Yes, but limit the amount because it is high in calories and can trigger bloating.' },
      { q: 'Is coffee allowed?', a: 'Yes, maximum 1 small cup a day only.' }
    ],
    references: ['POGI (Indonesian Society of Obstetrics & Gynecology)', 'WHO']
  },
  {
    id: 'busui',
    title: 'Breastfeeding',
    scientificName: 'Lactation',
    icon: <Baby className="text-blue-400" />,
    description: 'The breastfeeding phase requires more calories and fluids for quality milk production.',
    symptoms: ['Excessive thirst', 'Frequent hunger', 'Full-feeling breasts', 'Fatigue'],
    recommended: ['Katuk leaves & Spinach', 'Cooked Fish & Chicken', 'Almonds', 'Oatmeal', 'Ripe Papaya'],
    avoided: ['Alcoholic beverages', 'Excessive caffeine', 'Very spicy food (if baby is sensitive)', 'Over-the-counter medications'],
    nutritionalTargets: 'Extra calories (+500 kcal), high protein, abundant hydration (3-4 liters).',
    strategies: [
      'Keep a water bottle near the breastfeeding area.',
      'Eat healthy snacks between main meals.',
      'Vary protein sources so the baby gets used to different flavors.'
    ],
    faq: [
      { q: 'Why are Katuk leaves good?', a: 'Katuk leaves contain phytosterols that stimulate the mammary glands to produce breast milk.' },
      { q: 'Can I diet while breastfeeding?', a: 'It is better to avoid strict dieting so that milk quality is maintained.' }
    ],
    references: ['AIMI (Indonesian Breastfeeding Mothers Association)', 'CDC']
  },
  {
    id: 'laktosa',
    title: 'Lactose Intolerance',
    scientificName: 'Lactose Intolerance',
    icon: <AlertCircle className="text-orange-400" />,
    description: 'The inability to fully digest lactose (the sugar in milk) due to a deficiency of the lactase enzyme.',
    symptoms: ['Bloating & gas', 'Diarrhea after drinking milk', 'Flatulence', 'Abdominal cramps'],
    recommended: ['Soy/Almond milk', 'Hard cheeses (Cheddar)', 'Yogurt (fermented lactose)', 'High-calcium vegetables', 'Anchovies'],
    avoided: ['Pure cow\'s milk', 'Standard ice cream', 'Soft cheeses', 'Buttermilk', 'Milk-based cakes'],
    nutritionalTargets: 'Ensure Calcium and Vitamin D intake is fulfilled from non-dairy sources.',
    strategies: [
      'Choose products marked "Lactose Free".',
      'Try consuming fermented dairy products like kefir or yogurt.',
      'Read food labels to avoid milk derivatives (whey/casein).'
    ],
    faq: [
      { q: 'Is intolerance the same as an allergy?', a: 'Different. Intolerance is a digestive issue, while milk allergy is an immune system reaction.' },
      { q: 'Can I eat cheese?', a: 'Usually, hard cheeses like Cheddar are safe because their lactose content is very low.' }
    ],
    references: ['IDAI (Indonesian Pediatric Society)', 'Mayo Clinic']
  },
  {
    id: 'maag',
    title: 'Gastritis',
    scientificName: 'Dyspepsia',
    icon: <Thermometer className="text-red-400" />,
    description: 'Inflammation of the lining of the stomach causing heartburn and abdominal pain.',
    symptoms: ['Heartburn or stinging in the upper abdomen', 'Bloating', 'Nausea & vomiting', 'Feeling full quickly when eating'],
    recommended: ['Rice porridge/soft rice', 'Boiled potatoes', 'Non-acidic fruits (Melon)', 'Grilled fish', 'Chayote', 'Honey'],
    avoided: ['Spicy & acidic foods', 'Sticky rice & fermented cassava', 'Soda/carbonated drinks', 'Hard fried foods', 'Thick coconut milk'],
    nutritionalTargets: 'Soft-textured foods, low pH (non-acidic), limit sharp spices.',
    strategies: [
      'Do not let the stomach stay empty for too long.',
      'Eat small but frequent portions (5-6 times a day).',
      'Avoid eating in a hurry and talking while eating.'
    ],
    faq: [
      { q: 'Why is sticky rice prohibited for gastritis?', a: 'Sticky rice is difficult to digest and can trigger excessive stomach acid production.' },
      { q: 'Can I drink coffee?', a: 'It is highly recommended to avoid coffee during a gastritis flare-up because caffeine stimulates stomach acid.' }
    ],
    references: ['PGI', 'Ministry of Health RI']
  },
  {
    id: 'tipes',
    title: 'Typhoid Fever',
    scientificName: 'Enteric Fever',
    icon: <AlertCircle className="text-red-700" />,
    description: 'An infection of the digestive tract by Salmonella typhi bacteria attacking the small intestine.',
    symptoms: ['High fever (increasing at night)', 'Severe abdominal pain', 'Diarrhea or constipation', 'Dirty tongue (white coating)', 'Nausea & weakness'],
    recommended: ['Fine porridge/strained rice', 'Toasted white bread', 'Mashed potatoes', 'Ripe bananas', 'Tender boiled chicken', 'Boiled eggs'],
    avoided: ['Coarse fiber vegetables (Cassava leaves)', 'Small seeded fruits', 'Fried/hard foods', 'Spicy foods', 'Coconut milk'],
    nutritionalTargets: 'Low Fiber Diet (Low Residue), High Protein for intestinal tissue recovery.',
    strategies: [
      'Use ingredients that have been mashed or strained.',
      'Avoid foods that trigger gas like cabbage or mustard greens.',
      'Ensure all food and drinks are hygienic and thoroughly cooked.'
    ],
    faq: [
      { q: 'Why should I eat porridge?', a: 'To rest the intestines that are injured due to bacterial infection to prevent intestinal perforation.' },
      { q: 'Can I eat vegetables?', a: 'Yes, but only soft vegetables without coarse fiber like chayote or boiled carrots.' }
    ],
    references: ['IDAI', 'Ministry of Health RI', 'WHO']
  }
];

const PanduanPage = () => {
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
            <span>Health Knowledge Base</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-main)] mb-6">
            Nutrition <span className="text-[var(--primary-green)]">Guide</span>
          </h1>
          <p className="text-[var(--text-muted)] font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            NutriAI Health Education Center. Learn about your body's condition and find the best nutritional strategies for a healthier quality of life.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 relative group">
          <div className="absolute inset-0 bg-[var(--primary-green)]/10 blur-xl group-focus-within:bg-[var(--primary-green)]/20 transition-all rounded-full" />
          <div className="relative flex items-center bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl px-8 py-5 shadow-2xl">
            <Search className="text-[var(--primary-green)] mr-4" size={24} />
            <input 
              type="text"
              placeholder="Search health conditions (Diabetes, GERD, Hypertension...)"
              className="bg-transparent w-full outline-none text-[var(--text-main)] font-bold text-lg placeholder-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 text-center text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            Displaying {filteredConditions.length} Valid Medical Guides
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
                  Medical Detail
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
                  { id: 'nutrisi', label: 'Nutrition & Strategy', icon: <Apple size={14} /> },
                  { id: 'gejala', label: 'Symptoms & Target', icon: <Activity size={14} /> },
                  { id: 'faq', label: 'FAQ & Education', icon: <HelpCircle size={14} /> },
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
                          <h4 className="text-sm font-black uppercase tracking-widest">Highly Recommended</h4>
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
                          <h4 className="text-sm font-black uppercase tracking-widest">Must Avoid</h4>
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
                        <h4 className="text-sm font-black uppercase tracking-widest">Management Tips & Strategies</h4>
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
                        <h4 className="text-sm font-black uppercase tracking-widest">Common Symptoms & Signs</h4>
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
                        <h4 className="text-sm font-black uppercase tracking-widest">Daily Nutritional Target</h4>
                      </div>
                      <p className="text-lg font-bold text-[var(--text-main)] leading-relaxed">
                        {selectedCondition.nutritionalTargets}
                      </p>
                    </div>

                    {/* References */}
                    <div className="space-y-4 pt-12 border-t border-[var(--border-card)]">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="text-[var(--text-muted)]" size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Medical References & Validation</h4>
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
                  Done Reading
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
