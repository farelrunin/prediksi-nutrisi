import { 
  Droplets, HeartPulse, Wind, Activity, Stethoscope, Baby, AlertCircle, Thermometer 
} from 'lucide-react';
import React from 'react';

export const getHealthConditions = (language) => [
  {
    id: 'diabetes',
    title: language === 'id' ? 'Diabetes' : 'Diabetes',
    scientificName: 'Diabetes Mellitus',
    icon: <Droplets className="text-orange-500" />,
    description: language === 'id' ? 'Penyakit metabolik kronis yang ditandai dengan kadar gula darah tinggi akibat kegagalan produksi insulin atau penggunaan yang tidak efektif.' : 'A chronic metabolic disease characterized by high blood sugar due to failure in insulin production or effective use.',
    symptoms: language === 'id' ? 
      ['Sering haus (polidipsia)', 'Sering buang air kecil, terutama malam hari', 'Pandangan kabur', 'Luka sulit sembuh', 'Penurunan berat badan drastis tanpa sebab'] : 
      ['Frequent thirst (polydipsia)', 'Frequent urination, especially at night', 'Blurred vision', 'Slow-healing wounds', 'Drastic unexplained weight loss'],
    recommended: language === 'id' ? 
      ['Sayuran hijau', 'Nasi merah/Shirataki', 'Ikan Salmon/Tuna', 'Kacang-kacangan', 'Yogurt tanpa pemanis', 'Buah GI rendah (Apel/Pir)'] : 
      ['Leafy green vegetables', 'Brown rice/Shirataki', 'Salmon/Tuna', 'Nuts and seeds', 'Unsweetened yogurt', 'Low GI fruits (Apple/Pear)'],
    avoided: language === 'id' ? 
      ['Gula & sirup', 'Nasi putih porsi besar', 'Makanan berbahan tepung', 'Minuman manis kemasan', 'Buah kaleng'] : 
      ['Sugar & syrups', 'Large portions of white rice', 'Flour-based foods', 'Sweet packaged drinks', 'Canned fruits'],
    nutritionalTargets: language === 'id' ? 
      'Karbohidrat Kompleks (45-65% kalori), Serat Tinggi (>25g/hari), Batasi Gula Sederhana (<5% total kalori).' : 
      'Complex Carbohydrates (45-65% calories), High Fiber (>25g/day), Limit Simple Sugars (<5% total calories).',
    strategies: language === 'id' ? [
      'Gunakan metode "Piring T" (1/2 sayur, 1/4 karbo, 1/4 protein).',
      'Makan porsi kecil tapi sering (tiap 3-4 jam) untuk menjaga stabilitas gula.',
      'Hindari makan berat 2 jam sebelum tidur.',
      'Pilih metode kukus atau rebus dibanding goreng.'
    ] : [
      'Use the "T-Plate" method (1/2 vegetables, 1/4 carbs, 1/4 protein).',
      'Eat small but frequent portions (every 3-4 hours) to maintain sugar stability.',
      'Avoid heavy meals 2 hours before bedtime.',
      'Choose steaming or boiling methods instead of frying.'
    ],
    faq: language === 'id' ? [
      { q: 'Bolehkah penderita diabetes makan nasi putih?', a: 'Boleh, tapi dalam porsi yang sangat dibatasi (sekitar 1-2 centong) dan sebaiknya didampingi serat tinggi untuk memperlambat penyerapan gula.' },
      { q: 'Apakah buah manis dilarang total?', a: 'Tidak, buah seperti apel atau pir tetap boleh dimakan dengan kulitnya karena mengandung serat tinggi.' }
    ] : [
      { q: 'Can diabetics eat white rice?', a: 'Yes, but in strictly limited portions (about 1-2 scoops) and preferably accompanied by high fiber to slow down sugar absorption.' },
      { q: 'Are sweet fruits totally forbidden?', a: 'No, fruits like apples or pears can still be eaten with their skin because they contain high fiber.' }
    ],
    references: ['PERKENI', 'American Diabetes Association (ADA)', 'Kemenkes RI']
  },
  {
    id: 'hipertensi',
    title: language === 'id' ? 'Hipertensi' : 'Hypertension',
    scientificName: language === 'id' ? 'Tekanan Darah Tinggi' : 'High Blood Pressure',
    icon: <HeartPulse className="text-red-600" />,
    description: language === 'id' ? 'Kondisi kronis di mana tekanan darah pada arteri meningkat secara persisten (>130/80 mmHg).' : 'A chronic condition where the arterial blood pressure is persistently elevated (>130/80 mmHg).',
    symptoms: language === 'id' ? 
      ['Sakit kepala parah', 'Kelelahan atau kebingungan', 'Masalah penglihatan', 'Nyeri dada', 'Detak jantung tidak teratur'] : 
      ['Severe headache', 'Fatigue or confusion', 'Vision problems', 'Chest pain', 'Irregular heartbeat'],
    recommended: language === 'id' ? 
      ['Sayuran hijau (Bayam/Brokoli)', 'Buah beri (Stroberi/Blueberry)', 'Yogurt rendah lemak', 'Oatmeal', 'Pisang (Kaya Kalium)', 'Bawang putih'] : 
      ['Green vegetables (Spinach/Broccoli)', 'Berries (Strawberry/Blueberry)', 'Low-fat yogurt', 'Oatmeal', 'Bananas (Rich in Potassium)', 'Garlic'],
    avoided: language === 'id' ? 
      ['Garam berlebih', 'Daging olahan (Sosis/Ham)', 'Acar asin', 'Mie instan', 'Kulit ayam & lemak jenuh'] : 
      ['Excessive salt', 'Processed meats (Sausage/Ham)', 'Salty pickles', 'Instant noodles', 'Chicken skin & saturated fats'],
    nutritionalTargets: language === 'id' ? 
      'Diet DASH (Dietary Approaches to Stop Hypertension), Natrium < 2000mg/hari (setara 1 sdt garam).' : 
      'DASH Diet (Dietary Approaches to Stop Hypertension), Sodium < 2000mg/day (equivalent to 1 tsp salt).',
    strategies: language === 'id' ? [
      'Gunakan rempah alami sebagai pengganti garam (jeruk nipis, lada).',
      'Selalu cek label nutrisi pada kemasan (pilih rendah natrium).',
      'Tingkatkan asupan kalium dari buah untuk membantu membuang kelebihan garam.'
    ] : [
      'Use natural spices instead of salt (lime, pepper).',
      'Always check nutrition labels on packaging (choose low sodium).',
      'Increase potassium intake from fruit to help flush out excess salt.'
    ],
    faq: language === 'id' ? [
      { q: 'Mengapa garam menyebabkan darah tinggi?', a: 'Garam mengikat air dalam pembuluh darah, meningkatkan volume darah yang membuat jantung bekerja lebih keras.' },
      { q: 'Apakah kopi diperbolehkan untuk hipertensi?', a: 'Kafein dapat meningkatkan tekanan darah sementara; batasi 1-2 cangkir sehari.' }
    ] : [
      { q: 'Why does salt cause high blood pressure?', a: 'Salt binds water in the blood vessels, increasing blood volume which makes the heart work harder.' },
      { q: 'Is coffee allowed for hypertension?', a: 'Caffeine can temporarily increase blood pressure; limit to 1-2 cups a day.' }
    ],
    references: ['PERHI', 'AHA (American Heart Association)']
  },
  {
    id: 'gerd',
    title: 'GERD',
    scientificName: language === 'id' ? 'Asam Lambung' : 'Acid Reflux',
    icon: <Wind className="text-emerald-500" />,
    description: language === 'id' ? 'Kondisi di mana isi lambung mengalir kembali ke kerongkongan, menyebabkan sensasi terbakar (heartburn).' : 'A condition where stomach contents flow back into the esophagus, causing a burning sensation (heartburn).',
    symptoms: language === 'id' ? 
      ['Sensasi terbakar di dada (heartburn)', 'Rasa asam di mulut', 'Suara serak', 'Batuk kering kronis', 'Kesulitan menelan'] : 
      ['Burning sensation in the chest (heartburn)', 'Acid taste in the mouth', 'Hoarseness', 'Chronic dry cough', 'Difficulty swallowing'],
    recommended: language === 'id' ? 
      ['Jahe (anti-inflamasi)', 'Oatmeal', 'Pisang & Melon', 'Putih telur', 'Daging tanpa lemak (rebus)', 'Lidah buaya'] : 
      ['Ginger (anti-inflammatory)', 'Oatmeal', 'Bananas & Melons', 'Egg whites', 'Lean meat (boiled)', 'Aloe vera'],
    avoided: language === 'id' ? 
      ['Cokelat & Mint', 'Makanan pedas & asam', 'Gorengan/lemak tinggi', 'Kopi & Alkohol', 'Minuman berkarbonasi'] : 
      ['Chocolate & Mint', 'Spicy & acidic foods', 'Fried/high-fat foods', 'Coffee & Alcohol', 'Carbonated drinks'],
    nutritionalTargets: language === 'id' ? 
      'Fokus pada makanan pH Alkali (Netral), protein tanpa lemak, dan porsi kecil.' : 
      'Focus on Alkaline (Neutral) pH foods, lean protein, and small portions.',
    strategies: language === 'id' ? [
      'Jangan langsung berbaring setelah makan (tunggu minimal 3 jam).',
      'Makan secara perlahan dan kunyah hingga halus.',
      'Hindari pakaian ketat di area perut saat makan.'
    ] : [
      'Do not lie down immediately after eating (wait at least 3 hours).',
      'Eat slowly and chew thoroughly.',
      'Avoid tight clothing in the abdominal area while eating.'
    ],
    faq: language === 'id' ? [
      { q: 'Bolehkah minum air hangat saat kumat?', a: 'Air hangat membantu menenangkan, namun hindari campuran lemon atau jeruk.' },
      { q: 'Mengapa cokelat dilarang?', a: 'Cokelat mengandung methylxanthine yang melemaskan katup bawah kerongkongan, sehingga asam mudah naik.' }
    ] : [
      { q: 'Can I drink warm water during a flare-up?', a: 'Warm water helps soothe, but avoid mixing it with lemon or orange.' },
      { q: 'Why is chocolate prohibited?', a: 'Chocolate contains methylxanthine which relaxes the lower esophageal valve, allowing acid to rise easily.' }
    ],
    references: ['PGI', 'Mayo Clinic']
  },
  {
    id: 'asam-urat',
    title: language === 'id' ? 'Asam Urat' : 'Gout',
    scientificName: 'Gouty Arthritis (Hyperuricemia)',
    icon: <HeartPulse className="text-purple-500" />,
    description: language === 'id' ? 'Peradangan sendi yang menyakitkan yang disebabkan oleh penumpukan kristal monosodium urat di sendi.' : 'A painful inflammatory arthritis caused by the buildup of monosodium urate crystals in the joints.',
    symptoms: language === 'id' ? 
      ['Nyeri sendi mendadak dan parah', 'Sendi bengkak dan merah', 'Sensasi panas di area sendi', 'Kekakuan sendi di pagi hari'] : 
      ['Sudden and severe joint pain', 'Swollen and red joints', 'Heat sensation in the joint area', 'Joint stiffness in the morning'],
    recommended: language === 'id' ? 
      ['Air putih (min. 2L/hari)', 'Ceri & beri', 'Sayuran hijau (non-bayam)', 'Susu rendah lemak', 'Karbohidrat kompleks'] : 
      ['Water (min. 2L/day)', 'Cherries & berries', 'Green vegetables (non-spinach)', 'Low-fat milk', 'Complex carbohydrates'],
    avoided: language === 'id' ? 
      ['Jeroan (hati, ginjal)', 'Daging merah (kambing/sapi)', 'Seafood (udang, kerang)', 'Minuman manis/fruktosa', 'Emping melinjo'] : 
      ['Organ meats (liver, kidney)', 'Red meat (lamb/beef)', 'Seafood (shrimp, shellfish)', 'Sweet drinks/fructose', 'Melinjo chips'],
    nutritionalTargets: language === 'id' ? 
      'Diet Rendah Purin (<150mg purin/hari), hidrasi tinggi untuk membuang kristal urat.' : 
      'Low Purine Diet (<150mg purine/day), high hydration to flush out urate crystals.',
    strategies: language === 'id' ? [
      'Minum segelas air setiap 2 jam.',
      'Pilih sumber protein dari nabati (tempe/tahu) atau susu rendah lemak.',
      'Hindari penggunaan kaldu daging kental dalam masakan.'
    ] : [
      'Drink a glass of water every 2 hours.',
      'Choose protein sources from plants (tempeh/tofu) or low-fat milk.',
      'Avoid using thick meat broth in cooking.'
    ],
    faq: language === 'id' ? [
      { q: 'Bolehkah penderita asam urat makan kangkung?', a: 'Boleh, namun dalam porsi moderat karena kangkung mengandung purin sedang.' },
      { q: 'Mengapa ceri baik untuk asam urat?', a: 'Ceri mengandung antosianin yang bersifat anti-inflamasi dan membantu menurunkan kadar asam urat.' }
    ] : [
      { q: 'Can gout sufferers eat water spinach?', a: 'Yes, but in moderate portions because water spinach contains moderate purines.' },
      { q: 'Why are cherries good for gout?', a: 'Cherries contain anthocyanins which are anti-inflammatory and help lower uric acid levels.' }
    ],
    references: ['IRA', 'Arthritis Foundation']
  },
  {
    id: 'batu-empedu',
    title: language === 'id' ? 'Batu Empedu' : 'Gallstones',
    scientificName: 'Cholelithiasis',
    icon: <Activity className="text-yellow-600" />,
    description: language === 'id' ? 'Endapan cairan empedu yang mengeras yang dapat terbentuk di kantong empedu Anda.' : 'Hardened deposits of digestive fluid that can form in your gallbladder.',
    symptoms: language === 'id' ? 
      ['Nyeri hebat di perut kanan atas', 'Mual dan muntah setelah makan berlemak', 'Nyeri punggung di antara tulang belikat', 'Nyeri di bahu kanan'] : 
      ['Severe pain in the upper right abdomen', 'Nausea and vomiting after eating fatty meals', 'Back pain between the shoulder blades', 'Pain in the right shoulder'],
    recommended: language === 'id' ? 
      ['Makanan tinggi serat (Gandum/Oat)', 'Buah & sayur segar', 'Biji-bijian utuh', 'Ikan Salmon', 'Minyak Zaitun'] : 
      ['High fiber foods (Wheat/Oat)', 'Fresh fruits & vegetables', 'Whole grains', 'Salmon', 'Olive Oil'],
    avoided: language === 'id' ? 
      ['Gorengan & lemak jenuh', 'Daging berlemak', 'Susu full cream', 'Mentega/Margarin', 'Kuning telur berlebih'] : 
      ['Fried & saturated fats', 'Fatty meats', 'Full cream milk', 'Butter/Margarine', 'Excessive egg yolks'],
    nutritionalTargets: language === 'id' ? 
      'Diet Rendah Lemak (<30% total kalori), Serat Larut Tinggi (>20g/hari).' : 
      'Low Fat Diet (<30% total calories), High Soluble Fiber (>20g/day).',
    strategies: language === 'id' ? [
      'Gunakan metode masak rebus, kukus, atau panggang.',
      'Kurangi asupan kolesterol hewani.',
      'Jangan melewatkan sarapan untuk mencegah pengentalan empedu.'
    ] : [
      'Use boiling, steaming, or grilling cooking methods.',
      'Reduce animal cholesterol intake.',
      'Do not skip breakfast to prevent thickening of bile.'
    ],
    faq: language === 'id' ? [
      { q: 'Apakah diet Keto aman untuk batu empedu?', a: 'Sangat tidak disarankan, karena lemak tinggi dapat memicu kolik bilier (serangan nyeri).' },
      { q: 'Apakah kopi membantu?', a: 'Beberapa studi menunjukkan kopi dapat merangsang kontraksi kantong empedu, namun konsultasikan dulu dengan dokter.' }
    ] : [
      { q: 'Is Keto diet okay for gallstones?', a: 'Highly not recommended, because high fat can trigger biliary colic (pain attacks).' },
      { q: 'Does coffee help?', a: 'Some studies show coffee can stimulate gallbladder contractions, but consult your doctor first.' }
    ],
    references: ['PGI', 'Mayo Clinic']
  },
  {
    id: 'batu-ginjal',
    title: language === 'id' ? 'Batu Ginjal' : 'Kidney Stones',
    scientificName: 'Nephrolitiasis',
    icon: <Stethoscope className="text-blue-600" />,
    description: language === 'id' ? 'Endapan keras yang terbuat dari mineral dan garam yang terbentuk di dalam ginjal Anda.' : 'Hard deposits made of minerals and salts that form inside your kidneys.',
    symptoms: language === 'id' ? 
      ['Nyeri tajam di sisi atau punggung', 'Nyeri saat buang air kecil', 'Urine keruh atau kemerahan', 'Mual dan muntah'] : 
      ['Sharp pain in the side or back', 'Pain during urination', 'Cloudy or reddish urine', 'Nausea and vomiting'],
    recommended: language === 'id' ? 
      ['Air Putih (Sangat Penting)', 'Lemon/Sitrus', 'Kalsium dari makanan alami', 'Buah dengan kandungan air tinggi'] : 
      ['Water (Crucial)', 'Lemon/Citrus', 'Calcium from natural foods', 'High water content fruits'],
    avoided: language === 'id' ? 
      ['Garam tinggi (natrium)', 'Bayam & Bit (Tinggi oksalat)', 'Kacang tanah', 'Teh pekat', 'Protein hewani berlebih'] : 
      ['High salt (sodium)', 'Spinach & Beets (High oxalate)', 'Peanuts', 'Strong tea', 'Excessive animal protein'],
    nutritionalTargets: language === 'id' ? 
      'Hidrasi urine > 2,5 liter per hari, Batasi Oksalat dan Natrium.' : 
      'Urine hydration > 2.5 liters per day, Limit Oxalate and Sodium.',
    strategies: language === 'id' ? [
      'Pastikan warna urine kuning muda jernih sebagai tanda hidrasi cukup.',
      'Kurangi konsumsi daging merah yang dapat meningkatkan asam urat di ginjal.',
      'Konsumsi makanan kalsium bersamaan dengan makanan oksalat agar mengikat di usus (bukan di ginjal).'
    ] : [
      'Ensure urine is clear light yellow as a sign of sufficient hydration.',
      'Reduce consumption of red meat which can increase uric acid in the kidneys.',
      'Consume calcium foods along with oxalate foods to bind them in the gut (not in the kidneys).'
    ],
    faq: language === 'id' ? [
      { q: 'Mengapa lemon baik untuk batu ginjal?', a: 'Lemon mengandung sitrat yang mencegah pembentukan kristal kalsium menjadi batu.' },
      { q: 'Apakah air putih saja cukup?', a: 'Ya, air putih adalah pengobatan dan pencegahan nomor satu.' }
    ] : [
      { q: 'Why is lemon good for kidney stones?', a: 'Lemon contains citrate which prevents the formation of calcium crystals into stones.' },
      { q: 'Is water alone enough?', a: 'Yes, water is the number one treatment and prevention.' }
    ],
    references: ['IAUI', 'National Kidney Foundation']
  },
  {
    id: 'chronic-kidney-disease',
    title: language === 'id' ? 'Penyakit Ginjal Kronis' : 'Chronic Kidney Disease',
    scientificName: 'CKD',
    icon: <Activity className="text-blue-800" />,
    description: language === 'id' ? 'Kehilangan fungsi ginjal secara bertahap seiring waktu, mempengaruhi kemampuan tubuh untuk menyaring limbah dari darah.' : "A gradual loss of kidney function over time, affecting the body's ability to filter waste from the blood.",
    symptoms: language === 'id' ? 
      ['Pembengkakan di tangan/kaki (edema)', 'Sesak napas', 'Gatal-gatal kronis', 'Urine berbusa', 'Nafsu makan menurun'] : 
      ['Swelling in hands/feet (edema)', 'Shortness of breath', 'Chronic itching', 'Foamy urine', 'Decreased appetite'],
    recommended: language === 'id' ? 
      ['Putih telur (protein bersih)', 'Kembang kol', 'Blueberry', 'Bawang putih', 'Roti putih/Pasta (Rendah fosfor)'] : 
      ['Egg whites (clean protein)', 'Cauliflower', 'Blueberries', 'Garlic', 'White bread/Pasta (Low phosphorus)'],
    avoided: language === 'id' ? 
      ['Garam dapur', 'Pisang & Alpukat (Tinggi kalium)', 'Produk susu (Tinggi fosfor)', 'Daging olahan', 'Roti gandum utuh'] : 
      ['Table salt', 'Bananas & Avocados (High potassium)', 'Dairy products (High phosphorus)', 'Processed meats', 'Whole wheat bread'],
    nutritionalTargets: language === 'id' ? 
      'Batasi Protein (0,6-0,8g/kg BB), Rendah Kalium (<2000mg), Rendah Fosfor.' : 
      'Limit Protein (0.6-0.8g/kg body weight), Low Potassium (<2000mg), Low Phosphorus.',
    strategies: language === 'id' ? [
      'Rendam sayuran dalam air hangat sebelum dimasak untuk mengurangi kadar kalium.',
      'Gunakan bumbu alami (asam, bawang putih) sebagai pengganti garam.',
      'Pantau asupan cairan secara ketat sesuai saran dokter.'
    ] : [
      'Soak vegetables in warm water before cooking to reduce potassium levels.',
      'Use natural seasonings (sour, garlic) instead of salt.',
      'Strictly monitor fluid intake as advised by your doctor.'
    ],
    faq: language === 'id' ? [
      { q: 'Mengapa pisang dilarang?', a: 'Ginjal yang rusak sulit membuang kelebihan kalium dari pisang, yang bisa berbahaya bagi ritme jantung.' },
      { q: 'Bolehkah makan nasi?', a: 'Boleh, nasi putih lebih baik dibanding gandum utuh karena kandungan fosfornya lebih rendah.' }
    ] : [
      { q: 'Why are bananas prohibited?', a: 'Damaged kidneys have difficulty removing excess potassium from bananas, which can be dangerous for heart rhythm.' },
      { q: 'Can I eat rice?', a: 'Yes, white rice is better than whole grains because its phosphorus content is lower.' }
    ],
    references: ['PERNEFRI', 'NKF']
  },
  {
    id: 'hipotensi',
    title: language === 'id' ? 'Hipotensi' : 'Hypotension',
    scientificName: language === 'id' ? 'Tekanan Darah Rendah' : 'Low Blood Pressure',
    icon: <Droplets className="text-pink-400" />,
    description: language === 'id' ? 'Kondisi di mana tekanan darah berada di bawah normal (90/60 mmHg), yang dapat menyebabkan pusing atau pingsan.' : 'A condition where blood pressure is below normal (90/60 mmHg), which can cause dizziness or fainting.',
    symptoms: language === 'id' ? 
      ['Pusing atau kliyengan', 'Pandangan kabur', 'Mual', 'Pingsan (sinkop)', 'Kurang konsentrasi'] : 
      ['Dizziness or lightheadedness', 'Blurred vision', 'Nausea', 'Fainting (syncope)', 'Lack of concentration'],
    recommended: language === 'id' ? 
      ['Makanan asin (dalam batas wajar)', 'Air mineral (elektrolit)', 'Telur & Daging merah', 'Kopi/Teh pagi', 'Kacang-kacangan'] : 
      ['Salty foods (in moderation)', 'Mineral water (electrolytes)', 'Eggs & Red meat', 'Morning Coffee/Tea', 'Nuts and seeds'],
    avoided: language === 'id' ? 
      ['Alkohol (dehidrasi)', 'Melewatkan jam makan', 'Diet terlalu rendah garam'] : 
      ['Alcohol (dehydrating)', 'Skipping meals', 'Diet too low in salt'],
    nutritionalTargets: language === 'id' ? 
      'Tingkatkan Natrium (garam) secara terukur, hidrasi tinggi untuk meningkatkan volume darah.' : 
      'Increase Sodium (salt) measurably, high hydration to increase blood volume.',
    strategies: language === 'id' ? [
      'Makan dengan porsi kecil namun sering daripada satu kali makan besar.',
      'Tingkatkan asupan air mineral minimal 2,5 - 3 liter sehari.',
      'Gunakan stocking kompresi jika diperlukan.'
    ] : [
      'Eat in small but frequent portions rather than one large meal.',
      'Increase mineral water intake to at least 2.5 - 3 liters a day.',
      'Use compression stocking if necessary.'
    ],
    faq: language === 'id' ? [
      { q: 'Bolehkah saya makan banyak garam?', a: 'Ya, namun tetap dalam batas wajar dan pilih garam berkualitas.' },
      { q: 'Mengapa porsi makan kecil lebih baik?', a: 'Makan besar dapat memicu penurunan tekanan darah setelah makan (hipotensi postprandial).' }
    ] : [
      { q: 'Can I eat a lot of salt?', a: 'Yes, but still within reasonable limits and choose quality salt.' },
      { q: 'Why are small meal portions better?', a: 'Large meals can trigger a drop in blood pressure after eating (postprandial hypotension).' }
    ],
    references: ['Kemenkes RI', 'American Heart Association']
  },
  {
    id: 'bumil',
    title: language === 'id' ? 'Kehamilan' : 'Pregnancy',
    scientificName: 'Maternal Health',
    icon: <Baby className="text-pink-500" />,
    description: language === 'id' ? 'Kehamilan memerlukan nutrisi spesifik untuk mendukung pertumbuhan janin dan kesehatan ibu.' : 'Pregnancy requires specific nutrients to support fetal growth and maternal health.',
    symptoms: language === 'id' ? 
      ['Morning sickness', 'Kelelahan', 'Sering buang air kecil', 'Perubahan nafsu makan', 'Kram perut'] : 
      ['Morning sickness', 'Fatigue', 'Frequent urination', 'Appetite changes', 'Abdominal cramps'],
    recommended: language === 'id' ? 
      ['Sayuran hijau (Asam Folat)', 'Daging matang sempurna', 'Ikan rendah merkuri', 'Telur & susu kehamilan', 'Kacang-kacangan'] : 
      ['Green vegetables (Folic Acid)', 'Fully cooked meat', 'Low-mercury fish', 'Eggs & prenatal milk', 'Nuts and seeds'],
    avoided: language === 'id' ? 
      ['Sushi/Daging mentah', 'Susu non-pasteurisasi', 'Ikan tinggi merkuri (Hiu/Makarel)', 'Kafein berlebih', 'Alkohol'] : 
      ['Sushi/Raw meat', 'Unpasteurized milk', 'High-mercury fish (Shark/King Mackerel)', 'Excessive caffeine', 'Alcohol'],
    nutritionalTargets: language === 'id' ? 
      'Kalori ekstra (+300-500 kkal), Zat Besi (27mg), Asam Folat (600mcg).' : 
      'Extra calories (+300-500 kcal), Iron (27mg), Folic Acid (600mcg).',
    strategies: language === 'id' ? [
      'Pastikan semua makanan hewani dimasak matang sempurna.',
      'Cuci bersih semua sayuran dan buah mentah.',
      'Minum minimal 10-12 gelas air sehari.'
    ] : [
      'Ensure all animal foods are cooked thoroughly.',
      'Thoroughly wash all raw vegetables and fruits.',
      'Drink at least 10-12 glasses of water a day.'
    ],
    faq: language === 'id' ? [
      { q: 'Bolehkah makan durian?', a: 'Boleh, namun batasi jumlahnya karena tinggi kalori dan bisa memicu kembung.' },
      { q: 'Apakah kopi diperbolehkan?', a: 'Boleh, maksimal 1 cangkir kecil sehari saja.' }
    ] : [
      { q: 'Can I eat durian?', a: 'Yes, but limit the amount because it is high in calories and can trigger bloating.' },
      { q: 'Is coffee allowed?', a: 'Yes, maximum 1 small cup a day only.' }
    ],
    references: ['POGI', 'WHO']
  },
  {
    id: 'busui',
    title: language === 'id' ? 'Menyusui' : 'Breastfeeding',
    scientificName: 'Lactation',
    icon: <Baby className="text-blue-400" />,
    description: language === 'id' ? 'Fase menyusui membutuhkan lebih banyak kalori dan cairan untuk produksi ASI yang berkualitas.' : 'The breastfeeding phase requires more calories and fluids for quality milk production.',
    symptoms: language === 'id' ? 
      ['Rasa haus berlebih', 'Sering lapar', 'Payudara terasa penuh', 'Kelelahan'] : 
      ['Excessive thirst', 'Frequent hunger', 'Full-feeling breasts', 'Fatigue'],
    recommended: language === 'id' ? 
      ['Daun Katuk & Bayam', 'Ikan & Ayam matang', 'Kacang Almond', 'Oatmeal', 'Pepaya Matang'] : 
      ['Katuk leaves & Spinach', 'Cooked Fish & Chicken', 'Almonds', 'Oatmeal', 'Ripe Papaya'],
    avoided: language === 'id' ? 
      ['Minuman beralkohol', 'Kafein berlebih', 'Makanan sangat pedas (jika bayi sensitif)', 'Obat-obatan tanpa resep'] : 
      ['Alcoholic beverages', 'Excessive caffeine', 'Very spicy food (if baby is sensitive)', 'Over-the-counter medications'],
    nutritionalTargets: language === 'id' ? 
      'Kalori ekstra (+500 kkal), protein tinggi, hidrasi melimpah (3-4 liter).' : 
      'Extra calories (+500 kcal), high protein, abundant hydration (3-4 liters).',
    strategies: language === 'id' ? [
      'Siapkan botol air minum di dekat area menyusui.',
      'Makan camilan sehat di sela jam makan utama.',
      'Variasikan sumber protein agar bayi terbiasa dengan rasa yang berbeda.'
    ] : [
      'Keep a water bottle near the breastfeeding area.',
      'Eat healthy snacks between main meals.',
      'Vary protein sources so the baby gets used to different flavors.'
    ],
    faq: language === 'id' ? [
      { q: 'Mengapa daun katuk baik?', a: 'Daun katuk mengandung fitosterol yang merangsang kelenjar susu memproduksi ASI.' },
      { q: 'Bolehkah diet saat menyusui?', a: 'Sebaiknya hindari diet ketat agar kualitas ASI tetap terjaga.' }
    ] : [
      { q: 'Why are Katuk leaves good?', a: 'Katuk leaves contain phytosterols that stimulate the mammary glands to produce breast milk.' },
      { q: 'Can I diet while breastfeeding?', a: 'It is better to avoid strict dieting so that milk quality is maintained.' }
    ],
    references: ['AIMI', 'CDC']
  },
  {
    id: 'laktosa',
    title: language === 'id' ? 'Intoleransi Laktosa' : 'Lactose Intolerance',
    scientificName: 'Lactose Intolerance',
    icon: <AlertCircle className="text-orange-400" />,
    description: language === 'id' ? 'Ketidakmampuan tubuh untuk mencerna laktosa (gula dalam susu) sepenuhnya karena kekurangan enzim laktase.' : 'The inability to fully digest lactose (the sugar in milk) due to a deficiency of the lactase enzyme.',
    symptoms: language === 'id' ? 
      ['Perut kembung & gas', 'Diare setelah minum susu', 'Sering buang angin', 'Kram perut'] : 
      ['Bloating & gas', 'Diarrhea after drinking milk', 'Flatulence', 'Abdominal cramps'],
    recommended: language === 'id' ? 
      ['Susu Kedelai/Almond', 'Keju keras (Cheddar)', 'Yogurt (laktosa terfermentasi)', 'Sayuran tinggi kalsium', 'Ikan teri'] : 
      ['Soy/Almond milk', 'Hard cheeses (Cheddar)', 'Yogurt (fermented lactose)', 'High-calcium vegetables', 'Anchovies'],
    avoided: language === 'id' ? 
      ["Susu sapi murni", "Es krim standar", "Keju lunak", "Buttermilk", "Kue berbahan susu"] : 
      ['Pure cow\'s milk', 'Standard ice cream', 'Soft cheeses', 'Buttermilk', 'Milk-based cakes'],
    nutritionalTargets: language === 'id' ? 
      'Pastikan asupan Kalsium dan Vitamin D terpenuhi dari sumber non-dairy.' : 
      'Ensure Calcium and Vitamin D intake is fulfilled from non-dairy sources.',
    strategies: language === 'id' ? [
      'Pilih produk bertanda "Lactose Free".',
      'Coba konsumsi produk olahan susu fermentasi seperti kefir atau yogurt.',
      'Baca label makanan untuk menghindari turunan susu (whey/kasein).'
    ] : [
      'Choose products marked "Lactose Free".',
      'Try consuming fermented dairy products like kefir or yogurt.',
      'Read food labels to avoid milk derivatives (whey/casein).'
    ],
    faq: language === 'id' ? [
      { q: 'Apakah intoleransi sama dengan alergi?', a: 'Berbeda. Intoleransi adalah masalah pencernaan, sedangkan alergi susu adalah reaksi sistem imun.' },
      { q: 'Bolehkah makan keju?', a: 'Biasanya keju keras seperti Cheddar aman karena kandungan laktosanya sangat rendah.' }
    ] : [
      { q: 'Is intolerance the same as an allergy?', a: 'Different. Intolerance is a digestive issue, while milk allergy is an immune system reaction.' },
      { q: 'Can I eat cheese?', a: 'Usually, hard cheeses like Cheddar are safe because their lactose content is very low.' }
    ],
    references: ['IDAI', 'Mayo Clinic']
  },
  {
    id: 'maag',
    title: language === 'id' ? 'Maag' : 'Gastritis',
    scientificName: 'Dyspepsia',
    icon: <Thermometer className="text-red-400" />,
    description: language === 'id' ? 'Peradangan pada lapisan lambung yang menyebabkan nyeri ulu hati dan sakit perut.' : 'Inflammation of the lining of the stomach causing heartburn and abdominal pain.',
    symptoms: language === 'id' ? 
      ['Nyeri ulu hati atau perih', 'Perut kembung', 'Mual & muntah', 'Cepat merasa kenyang saat makan'] : 
      ['Heartburn or stinging in the upper abdomen', 'Bloating', 'Nausea & vomiting', 'Feeling full quickly when eating'],
    recommended: language === 'id' ? 
      ['Bubur nasi/nasi lembek', 'Kentang rebus', 'Buah non-asam (Melon)', 'Ikan panggang', 'Labu siam', 'Madu'] : 
      ['Rice porridge/soft rice', 'Boiled potatoes', 'Non-acidic fruits (Melon)', 'Grilled fish', 'Chayote', 'Honey'],
    avoided: language === 'id' ? 
      ['Makanan pedas & asam', 'Ketan & tape', 'Soda/minuman berkarbonasi', 'Gorengan keras', 'Santan kental'] : 
      ['Spicy & acidic foods', 'Sticky rice & fermented cassava', 'Soda/carbonated drinks', 'Hard fried foods', 'Thick coconut milk'],
    nutritionalTargets: language === 'id' ? 
      'Makanan tekstur lunak, pH rendah (non-asam), batasi bumbu tajam.' : 
      'Soft-textured foods, low pH (non-acidic), limit sharp spices.',
    strategies: language === 'id' ? [
      'Jangan biarkan perut kosong terlalu lama.',
      'Makan porsi kecil namun sering (5-6 kali sehari).',
      'Hindari makan terburu-buru dan berbicara saat makan.'
    ] : [
      'Do not let the stomach stay empty for too long.',
      'Eat small but frequent portions (5-6 times a day).',
      'Avoid eating in a hurry and talking while eating.'
    ],
    faq: language === 'id' ? [
      { q: 'Mengapa ketan dilarang untuk maag?', a: 'Ketan sulit dicerna dan dapat memicu produksi asam lambung berlebih.' },
      { q: 'Bolehkah minum kopi?', a: 'Sangat disarankan menghindari kopi saat maag kumat karena kafein merangsang asam lambung.' }
    ] : [
      { q: 'Why is sticky rice prohibited for gastritis?', a: 'Sticky rice is difficult to digest and can trigger excessive stomach acid production.' },
      { q: 'Can I drink coffee?', a: 'It is highly recommended to avoid coffee during a gastritis flare-up because caffeine stimulates stomach acid.' }
    ],
    references: ['PGI', 'Kemenkes RI']
  },
  {
    id: 'tipes',
    title: language === 'id' ? 'Tipes' : 'Typhoid Fever',
    scientificName: 'Enteric Fever',
    icon: <AlertCircle className="text-red-700" />,
    description: language === 'id' ? 'Infeksi saluran pencernaan oleh bakteri Salmonella typhi yang menyerang usus halus.' : 'An infection of the digestive tract by Salmonella typhi bacteria attacking the small intestine.',
    symptoms: language === 'id' ? 
      ['Demam tinggi (meningkat di malam hari)', 'Sakit perut parah', 'Diare atau sembelit', 'Lidah kotor (selaput putih)', 'Mual & lemas'] : 
      ['High fever (increasing at night)', 'Severe abdominal pain', 'Diarrhea or constipation', 'Dirty tongue (white coating)', 'Nausea & weakness'],
    recommended: language === 'id' ? 
      ['Bubur halus/nasi tim', 'Roti putih panggang', 'Kentang tumbuk', 'Pisang matang', 'Ayam rebus empuk', 'Telur rebus'] : 
      ['Fine porridge/strained rice', 'Toasted white bread', 'Mashed potatoes', 'Ripe bananas', 'Tender boiled chicken', 'Boiled eggs'],
    avoided: language === 'id' ? 
      ['Sayuran serat kasar (Daun singkong)', 'Buah berbiji kecil', 'Makanan gorengan/keras', 'Makanan pedas', 'Santan'] : 
      ['Coarse fiber vegetables (Cassava leaves)', 'Small seeded fruits', 'Fried/hard foods', 'Spicy foods', 'Coconut milk'],
    nutritionalTargets: language === 'id' ? 
      'Diet Rendah Serat (Low Residue), Protein Tinggi untuk pemulihan jaringan usus.' : 
      'Low Fiber Diet (Low Residue), High Protein for intestinal tissue recovery.',
    strategies: language === 'id' ? [
      'Gunakan bahan makanan yang dihaluskan atau disaring.',
      'Hindari makanan pemicu gas seperti kol atau sawi.',
      'Pastikan semua makanan dan minuman higienis dan matang sempurna.'
    ] : [
      'Use ingredients that have been mashed or strained.',
      'Avoid foods that trigger gas like cabbage or mustard greens.',
      'Ensure all food and drinks are hygienic and thoroughly cooked.'
    ],
    faq: language === 'id' ? [
      { q: 'Mengapa harus makan bubur?', a: 'Untuk mengistirahatkan usus yang sedang luka akibat infeksi bakteri agar tidak terjadi perforasi usus.' },
      { q: 'Bolehkah makan sayur?', a: 'Boleh, namun hanya sayur lunak tanpa serat kasar seperti labu siam atau wortel rebus.' }
    ] : [
      { q: 'Why should I eat porridge?', a: 'To rest the intestines that are injured due to bacterial infection to prevent intestinal perforation.' },
      { q: 'Can I eat vegetables?', a: 'Yes, but only soft vegetables without coarse fiber like chayote or boiled carrots.' }
    ],
    references: ['IDAI', 'Kemenkes RI', 'WHO']
  }
];
