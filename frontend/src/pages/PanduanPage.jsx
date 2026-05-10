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
    description: 'Penyakit metabolik kronis yang ditandai dengan gula darah tinggi akibat kegagalan produksi atau penggunaan insulin secara efektif.',
    symptoms: ['Sering merasa haus (polidipsia)', 'Sering buang air kecil terutama malam hari', 'Pandangan kabur', 'Luka yang sulit sembuh', 'Penurunan berat badan drastis tanpa sebab'],
    recommended: ['Sayuran hijau daun', 'Beras merah/Shirataki', 'Ikan salmon/Tuna', 'Kacang-kacangan', 'Yoghurt tanpa gula', 'Buah rendah GI (Apel/Pir)'],
    avoided: ['Gula pasir & sirup', 'Nasi putih porsi besar', 'Tepung-tepungan', 'Minuman kemasan manis', 'Buah kalengan'],
    nutritionalTargets: 'Karbohidrat Kompleks (45-65% kalori), Serat Tinggi (>25g/hari), Batasi Gula Sederhana (<5% total kalori).',
    strategies: [
      'Gunakan metode "Piring T" (1/2 sayur, 1/4 karbo, 1/4 protein).',
      'Makan porsi kecil tapi sering (tiap 3-4 jam) untuk menjaga kestabilan gula.',
      'Hindari makan berat 2 jam sebelum tidur.',
      'Pilih pengolahan kukus atau rebus daripada goreng.'
    ],
    faq: [
      { q: 'Bolehkah penderita diabetes makan nasi putih?', a: 'Boleh, tapi sangat dibatasi (sekitar 1-2 centong saja) dan sebaiknya didampingi serat tinggi agar penyerapan gula melambat.' },
      { q: 'Apakah buah manis dilarang total?', a: 'Tidak, buah seperti apel atau pir tetap boleh dimakan dengan kulitnya karena mengandung serat tinggi.' }
    ],
    references: ['PERKENI (Perkumpulan Endokrinologi Indonesia)', 'American Diabetes Association (ADA)', 'Kemenkes RI']
  },
  {
    id: 'hipertensi',
    title: 'Hipertensi',
    scientificName: 'Tekanan Darah Tinggi',
    icon: <HeartPulse className="text-red-600" />,
    description: 'Kondisi kronis di mana tekanan darah arteri meningkat secara persisten (>130/80 mmHg).',
    symptoms: ['Sakit kepala hebat', 'Kelelahan atau kebingungan', 'Masalah penglihatan', 'Nyeri dada', 'Detak jantung tidak teratur'],
    recommended: ['Sayuran hijau (Bayam/Brokoli)', 'Buah beri (Strawberry/Blueberry)', 'Yoghurt rendah lemak', 'Oatmeal', 'Pisang (Kaya Kalium)', 'Bawang putih'],
    avoided: ['Garam dapur berlebih', 'Daging olahan (Sosis/Ham)', 'Acar/Manisan asin', 'Mie instan', 'Kulit ayam & lemak jenuh'],
    nutritionalTargets: 'Diet DASH (Dietary Approaches to Stop Hypertension), Natrium < 2000mg/hari (setara 1 sdt garam).',
    strategies: [
      'Gunakan rempah-rempah alami sebagai pengganti garam (jeruk nipis, lada).',
      'Selalu cek label nutrisi pada kemasan (pilih yang rendah sodium).',
      'Tingkatkan asupan kalium dari buah untuk membantu mengeluarkan garam berlebih.'
    ],
    faq: [
      { q: 'Kenapa garam bikin darah tinggi?', a: 'Garam mengikat air dalam pembuluh darah, meningkatkan volume darah yang membuat jantung harus memompa lebih keras.' },
      { q: 'Apakah kopi boleh untuk hipertensi?', a: 'Kafein dapat meningkatkan tekanan darah sesaat, sebaiknya batasi 1-2 cangkir sehari saja.' }
    ],
    references: ['Perhimpunan Dokter Hipertensi Indonesia (PERHI)', 'AHA (American Heart Association)']
  },
  {
    id: 'gerd',
    title: 'GERD',
    scientificName: 'Refluks Asam Lambung',
    icon: <Wind className="text-emerald-500" />,
    description: 'Kondisi di mana isi lambung mengalir kembali ke kerongkongan, menyebabkan sensasi terbakar (heartburn).',
    symptoms: ['Rasa terbakar di dada (heartburn)', 'Rasa asam di mulut', 'Suara serak', 'Batuk kering kronis', 'Sulit menelan'],
    recommended: ['Jahe (antiradang)', 'Oatmeal', 'Pisang & Melon', 'Putih telur', 'Daging tanpa lemak (rebus)', 'Lidah buaya'],
    avoided: ['Cokelat & Mint', 'Makanan pedas & asam', 'Gorengan/lemak tinggi', 'Kopi & Alkohol', 'Minuman bersoda'],
    nutritionalTargets: 'Fokus pada makanan pH Alkali (Netral), Protein tanpa lemak, dan porsi kecil.',
    strategies: [
      'Jangan langsung berbaring setelah makan (tunggu minimal 3 jam).',
      'Makan perlahan dan kunyah sampai halus.',
      'Hindari pakaian ketat di area perut saat makan.'
    ],
    faq: [
      { q: 'Bolehkah minum air hangat saat kumat?', a: 'Air hangat membantu menenangkan, tapi hindari mencampurnya dengan lemon atau jeruk.' },
      { q: 'Kenapa cokelat dilarang?', a: 'Cokelat mengandung metilxantin yang mengendurkan katup kerongkongan bawah, sehingga asam mudah naik.' }
    ],
    references: ['PGI (Perhimpunan Gastroenterologi Indonesia)', 'Mayo Clinic']
  },
  {
    id: 'asam-urat',
    title: 'Asam Urat',
    scientificName: 'Artritis Gout (Hiperurisemia)',
    icon: <HeartPulse className="text-purple-500" />,
    description: 'Penyakit radang sendi yang menyakitkan akibat penumpukan kristal monosodium urat di persendian.',
    symptoms: ['Nyeri sendi mendadak dan parah', 'Sendi bengkak dan merah', 'Rasa panas di area sendi', 'Kekakuan sendi di pagi hari'],
    recommended: ['Air putih (min. 2L/hari)', 'Buah ceri & beri', 'Sayuran hijau (non-bayam)', 'Susu rendah lemak', 'Karbohidrat kompleks'],
    avoided: ['Jeroan (hati, ginjal)', 'Daging merah (kambing/sapi)', 'Seafood (udang, kerang)', 'Minuman manis/fruktosa', 'Emping melinjo'],
    nutritionalTargets: 'Diet Rendah Purin (<150mg purin/hari), Hidrasi tinggi untuk meluruhkan kristal urat.',
    strategies: [
      'Minum segelas air setiap 2 jam sekali.',
      'Pilih sumber protein dari nabati (tempe/tahu) atau susu rendah lemak.',
      'Hindari penggunaan kaldu daging kental dalam masakan.'
    ],
    faq: [
      { q: 'Apakah penderita asam urat boleh makan kangkung?', a: 'Boleh, tapi dalam porsi sedang karena kangkung mengandung purin sedang.' },
      { q: 'Kenapa ceri bagus untuk asam urat?', a: 'Ceri mengandung antosianin yang bersifat anti-inflamasi dan membantu menurunkan kadar asam urat.' }
    ],
    references: ['IRA (Indonesian Rheumatology Association)', 'Arthritis Foundation']
  },
  {
    id: 'batu-empedu',
    title: 'Batu Empedu',
    scientificName: 'Kolelitiasis',
    icon: <Activity className="text-yellow-600" />,
    description: 'Kondisi terbentuknya endapan cairan pencernaan yang mengeras di kantung empedu.',
    symptoms: ['Nyeri hebat di perut kanan atas', 'Mual dan muntah setelah makan berlemak', 'Nyeri punggung di antara tulang belikat', 'Sakit di bahu kanan'],
    recommended: ['Makanan tinggi serat (Gandum/Oat)', 'Buah & sayuran segar', 'Biji-bijian utuh', 'Ikan Salmon', 'Minyak Zaitun'],
    avoided: ['Gorengan & lemak jenuh', 'Daging berlemak', 'Susu full cream', 'Mentega/Margarin', 'Kuning telur berlebih'],
    nutritionalTargets: 'Diet Rendah Lemak (<30% total kalori), Serat Larut Tinggi (>20g/hari).',
    strategies: [
      'Gunakan metode masak rebus, kukus, atau panggang.',
      'Kurangi asupan kolesterol hewani.',
      'Jangan melewatkan sarapan untuk mencegah pengentalan cairan empedu.'
    ],
    faq: [
      { q: 'Bolehkah diet Keto untuk batu empedu?', a: 'Sangat tidak disarankan, karena lemak tinggi bisa memicu serangan nyeri empedu (kolik).' },
      { q: 'Apakah kopi membantu?', a: 'Beberapa studi menunjukkan kopi dapat merangsang kontraksi empedu, tapi konsultasikan dulu dengan dokter.' }
    ],
    references: ['PGI (Perhimpunan Gastroenterologi Indonesia)', 'Mayo Clinic']
  },
  {
    id: 'batu-ginjal',
    title: 'Batu Ginjal',
    scientificName: 'Nefrolitiasis',
    icon: <Stethoscope className="text-blue-600" />,
    description: 'Terbentuknya materi keras menyerupai batu akibat limbah zat dalam darah yang menumpuk dan mengkristal.',
    symptoms: ['Nyeri tajam di pinggang atau punggung', 'Nyeri saat buang air kecil', 'Urin berwarna keruh atau kemerahan', 'Mual dan muntah'],
    recommended: ['Air putih (Sangat Krusial)', 'Jeruk lemon/sitrun', 'Kalsium dari makanan alami', 'Buah-buahan tinggi air'],
    avoided: ['Garam (natrium) tinggi', 'Bayam & Bit (Tinggi oksalat)', 'Kacang tanah', 'Teh pekat', 'Protein hewani berlebih'],
    nutritionalTargets: 'Hidrasi urin > 2.5 liter per hari, Batasi Oksalat dan Sodium.',
    strategies: [
      'Pastikan urin berwarna kuning muda jernih sebagai tanda hidrasi cukup.',
      'Kurangi konsumsi daging merah yang bisa meningkatkan asam urat di ginjal.',
      'Konsumsi makanan berkalsium bersamaan dengan makanan beroksalat untuk mengikatnya di usus (bukan di ginjal).'
    ],
    faq: [
      { q: 'Kenapa lemon bagus untuk batu ginjal?', a: 'Lemon mengandung sitrat yang mencegah pembentukan kristal kalsium menjadi batu.' },
      { q: 'Apakah air putih saja cukup?', a: 'Ya, air putih adalah pengobatan dan pencegahan nomor satu.' }
    ],
    references: ['IAUI (Ikatan Ahli Urologi Indonesia)', 'National Kidney Foundation']
  },
  {
    id: 'gagal-ginjal',
    title: 'Gagal Ginjal Kronis',
    scientificName: 'Chronic Kidney Disease (CKD)',
    icon: <Activity className="text-blue-800" />,
    description: 'Kondisi penurunan fungsi ginjal secara bertahap dalam menyaring limbah dari darah.',
    symptoms: ['Pembengkakan di kaki/tangan (edema)', 'Sesak napas', 'Gatal-gatal kronis', 'Urin berbuih', 'Nafsu makan menurun'],
    recommended: ['Putih telur (protein bersih)', 'Kembang kol', 'Blueberry', 'Bawang putih', 'Putih roti/Pasta (Rendah fosfor)'],
    avoided: ['Garam dapur', 'Pisang & Alpukat (Tinggi kalium)', 'Produk susu (Tinggi fosfor)', 'Daging olahan', 'Roti gandum utuh'],
    nutritionalTargets: 'Batasi Protein (0.6-0.8g/kg BB), Rendah Kalium (<2000mg), Rendah Fosfor.',
    strategies: [
      'Rendam sayuran dalam air hangat sebelum dimasak untuk mengurangi kadar kalium.',
      'Gunakan bumbu alami (asam, bawang) daripada garam.',
      'Pantau ketat asupan cairan sesuai anjuran dokter.'
    ],
    faq: [
      { q: 'Kenapa pisang dilarang?', a: 'Ginjal yang rusak sulit mengeluarkan kelebihan kalium dari pisang, yang bisa berbahaya bagi detak jantung.' },
      { q: 'Bolehkah makan nasi?', a: 'Boleh, nasi putih lebih baik daripada gandum utuh karena fosfornya lebih rendah.' }
    ],
    references: ['PERNEFRI (Perhimpunan Nefrologi Indonesia)', 'NKF']
  },
  {
    id: 'hipotensi',
    title: 'Hipotensi',
    scientificName: 'Tekanan Darah Rendah',
    icon: <Droplets className="text-pink-400" />,
    description: 'Kondisi tekanan darah di bawah normal (90/60 mmHg) yang dapat menyebabkan pusing atau pingsan.',
    symptoms: ['Pusing atau kepala terasa ringan', 'Penglihatan kabur', 'Mual', 'Pingsan (sinkop)', 'Kurang konsentrasi'],
    recommended: ['Makanan asin (secukupnya)', 'Air mineral (elektrolit)', 'Telur & Daging merah', 'Kopi/Teh pagi', 'Kacang-kacangan'],
    avoided: ['Alkohol (bikin dehidrasi)', 'Melewatkan waktu makan', 'Diet terlalu rendah garam'],
    nutritionalTargets: 'Tingkatkan Natrium (garam) secara terukur, Hidrasi tinggi untuk meningkatkan volume darah.',
    strategies: [
      'Makan dalam porsi kecil tapi sering daripada sekali makan besar.',
      'Tingkatkan asupan air mineral minimal 2.5 - 3 liter sehari.',
      'Gunakan kaos kaki kompresi jika perlu.'
    ],
    faq: [
      { q: 'Bolehkan saya makan banyak garam?', a: 'Boleh, tapi tetap harus dalam batas wajar dan pilih garam yang berkualitas.' },
      { q: 'Kenapa porsi makan kecil lebih baik?', a: 'Makan porsi besar bisa memicu penurunan tekanan darah setelah makan (hipotensi postprandial).' }
    ],
    references: ['Kemenkes RI', 'American Heart Association']
  },
  {
    id: 'bumil',
    title: 'Ibu Hamil',
    scientificName: 'Pregnancy',
    icon: <Baby className="text-pink-500" />,
    description: 'Masa kehamilan membutuhkan nutrisi spesifik untuk mendukung pertumbuhan janin dan kesehatan ibu.',
    symptoms: ['Mual muntah (morning sickness)', 'Mudah lelah', 'Sering buang air kecil', 'Perubahan nafsu makan', 'Kram perut'],
    recommended: ['Sayuran hijau (Asam Folat)', 'Daging matang sempurna', 'Ikan rendah merkuri', 'Telur & Susu hamil', 'Kacang-kacangan'],
    avoided: ['Sushi/Daging mentah', 'Susu mentah (unpasteurized)', 'Ikan tinggi merkuri (Hiu)', 'Kafein berlebih', 'Alkohol'],
    nutritionalTargets: 'Kalori ekstra (+300-500 kkal), Zat Besi (27mg), Asam Folat (600mcg).',
    strategies: [
      'Pastikan semua makanan hewani dimasak sampai matang sempurna.',
      'Cuci bersih semua sayur dan buah mentah.',
      'Minum air minimal 10-12 gelas sehari.'
    ],
    faq: [
      { q: 'Bolehkah makan durian?', a: 'Boleh, tapi batasi jumlahnya karena tinggi kalori dan bisa memicu perut kembung.' },
      { q: 'Apakah kopi boleh?', a: 'Boleh, maksimal 1 cangkir kecil sehari saja.' }
    ],
    references: ['POGI (Perkumpulan Obstetri & Ginekologi Indonesia)', 'WHO']
  },
  {
    id: 'busui',
    title: 'Ibu Menyusui',
    scientificName: 'Laktasi',
    icon: <Baby className="text-blue-400" />,
    description: 'Fase menyusui membutuhkan kalori dan cairan lebih banyak untuk produksi ASI berkualitas.',
    symptoms: ['Rasa haus berlebih', 'Mudah lapar', 'Payudara terasa penuh', 'Kelelahan'],
    recommended: ['Daun Katuk & Bayam', 'Ikan & Ayam matang', 'Kacang Almond', 'Oatmeal', 'Pepaya matang'],
    avoided: ['Minuman beralkohol', 'Kafein berlebih', 'Makanan terlalu pedas (jika bayi sensitif)', 'Obat-obatan tanpa resep'],
    nutritionalTargets: 'Kalori ekstra (+500 kkal), Protein tinggi, Hidrasi melimpah (3-4 liter).',
    strategies: [
      'Siapkan botol air minum di dekat tempat menyusui.',
      'Makan camilan sehat di sela waktu makan berat.',
      'Variasikan sumber protein agar bayi terbiasa dengan rasa yang berbeda.'
    ],
    faq: [
      { q: 'Kenapa daun katuk bagus?', a: 'Daun katuk mengandung fitosterol yang merangsang kelenjar susu untuk produksi ASI.' },
      { q: 'Bolehkah diet saat menyusui?', a: 'Sebaiknya hindari diet ketat agar kualitas ASI tetap terjaga.' }
    ],
    references: ['AIMI (Asosiasi Ibu Menyusui Indonesia)', 'CDC']
  },
  {
    id: 'laktosa',
    title: 'Intoleransi Laktosa',
    scientificName: 'Lactose Intolerance',
    icon: <AlertCircle className="text-orange-400" />,
    description: 'Ketidakmampuan tubuh mencerna laktosa (gula susu) karena kekurangan enzim laktase.',
    symptoms: ['Perut kembung & begah', 'Diare setelah minum susu', 'Sering buang angin', 'Kram perut'],
    recommended: ['Susu kedelai/Almond', 'Keju keras (Cheddar)', 'Yoghurt (laktosa terfermentasi)', 'Sayuran tinggi kalsium', 'Ikan teri'],
    avoided: ['Susu sapi murni', 'Es krim standar', 'Keju lembut', 'Mentega susu', 'Kue berbahan susu'],
    nutritionalTargets: 'Pastikan asupan Kalsium dan Vitamin D tetap tercukupi dari sumber non-susu.',
    strategies: [
      'Pilih produk bertanda "Lactose Free".',
      'Coba konsumsi produk susu fermentasi seperti kefir atau yoghurt.',
      'Baca label makanan untuk menghindari bahan turunan susu (whey/casein).'
    ],
    faq: [
      { q: 'Apakah intoleransi sama dengan alergi?', a: 'Berbeda. Intoleransi adalah masalah pencernaan, sedangkan alergi susu adalah reaksi sistem imun.' },
      { q: 'Bolehkan penderita makan keju?', a: 'Biasanya keju keras seperti Cheddar aman karena kandungan laktosanya sangat rendah.' }
    ],
    references: ['IDAI (Ikatan Dokter Anak Indonesia)', 'Mayo Clinic']
  },
  {
    id: 'maag',
    title: 'Maag (Gastritis)',
    scientificName: 'Gastritis / Dispepsia',
    icon: <Thermometer className="text-red-400" />,
    description: 'Peradangan pada lapisan dinding lambung yang menyebabkan nyeri ulu hati.',
    symptoms: ['Nyeri atau perih di ulu hati', 'Perut kembung', 'Mual & muntah', 'Cepat merasa kenyang saat makan'],
    recommended: ['Bubur nasi/Nasi tim', 'Kentang rebus', 'Buah non-asam (Melon)', 'Ikan panggang', 'Sayur labu siam', 'Madu'],
    avoided: ['Makanan pedas & asam', 'Ketan & Tape', 'Minuman bersoda/berkarbonasi', 'Gorengan keras', 'Santan kental'],
    nutritionalTargets: 'Makanan tekstur lunak, pH rendah (tidak asam), batasi bumbu tajam.',
    strategies: [
      'Jangan membiarkan perut kosong terlalu lama.',
      'Makan dengan porsi kecil tapi sering (5-6 kali sehari).',
      'Hindari makan terburu-buru dan bicara saat makan.'
    ],
    faq: [
      { q: 'Kenapa ketan dilarang untuk maag?', a: 'Ketan sulit dicerna dan bisa memicu produksi asam lambung berlebih.' },
      { q: 'Bolehkah minum kopi?', a: 'Sangat disarankan untuk menghindari kopi saat maag kumat karena kafein merangsang asam lambung.' }
    ],
    references: ['PGI (Perhimpunan Gastroenterologi Indonesia)', 'Kemenkes RI']
  },
  {
    id: 'tipes',
    title: 'Tipes (Demam Tifoid)',
    scientificName: 'Typhoid Fever',
    icon: <AlertCircle className="text-red-700" />,
    description: 'Infeksi saluran pencernaan oleh bakteri Salmonella typhi yang menyerang usus halus.',
    symptoms: ['Demam tinggi (meningkat di malam hari)', 'Sakit perut hebat', 'Diare atau sembelit', 'Lidah kotor (putih)', 'Mual & lemas'],
    recommended: ['Bubur halus/Nasi saring', 'Roti putih panggang', 'Kentang tumbuk', 'Pisang matang', 'Ayam rebus empuk', 'Telur rebus'],
    avoided: ['Sayuran berserat kasar (Daun singkong)', 'Buah berbiji kecil', 'Gorengan/makanan keras', 'Makanan pedas', 'Santan'],
    nutritionalTargets: 'Diet Rendah Serat (Sisa Rendah), Protein Tinggi untuk pemulihan jaringan usus.',
    strategies: [
      'Gunakan bahan makanan yang sudah dihaluskan atau disaring.',
      'Hindari makanan yang memicu gas seperti kol atau sawi.',
      'Pastikan semua makanan dan minuman higienis dan benar-benar matang.'
    ],
    faq: [
      { q: 'Kenapa harus makan bubur?', a: 'Untuk mengistirahatkan usus yang sedang luka akibat infeksi bakteri agar tidak terjadi kebocoran usus.' },
      { q: 'Bolehkah makan sayur?', a: 'Boleh, tapi hanya sayuran lunak dan tanpa serat kasar seperti labu siam atau wortel rebus.' }
    ],
    references: ['IDAI', 'Kemenkes RI', 'WHO']
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
            Panduan <span className="text-[var(--primary-green)]">Nutrisi</span>
          </h1>
          <p className="text-[var(--text-muted)] font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            Pusat edukasi kesehatan NutriAI. Pelajari kondisi tubuh Anda dan temukan strategi nutrisi terbaik untuk kualitas hidup yang lebih sehat.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 relative group">
          <div className="absolute inset-0 bg-[var(--primary-green)]/10 blur-xl group-focus-within:bg-[var(--primary-green)]/20 transition-all rounded-full" />
          <div className="relative flex items-center bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl px-8 py-5 shadow-2xl">
            <Search className="text-[var(--primary-green)] mr-4" size={24} />
            <input 
              type="text"
              placeholder="Cari kondisi kesehatan (Diabetes, GERD, Hipertensi...)"
              className="bg-transparent w-full outline-none text-[var(--text-main)] font-bold text-lg placeholder-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 text-center text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            Menampilkan {filteredConditions.length} Panduan Medis Valid
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
                  Detail Medis
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
                  { id: 'nutrisi', label: 'Nutrisi & Strategi', icon: <Apple size={14} /> },
                  { id: 'gejala', label: 'Gejala & Target', icon: <Activity size={14} /> },
                  { id: 'faq', label: 'FAQ & Edukasi', icon: <HelpCircle size={14} /> },
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
                          <h4 className="text-sm font-black uppercase tracking-widest">Sangat Direkomendasikan</h4>
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
                          <h4 className="text-sm font-black uppercase tracking-widest">Wajib Dihindari</h4>
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
                        <h4 className="text-sm font-black uppercase tracking-widest">Tips Pengelolaan & Strategi</h4>
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
                        <h4 className="text-sm font-black uppercase tracking-widest">Gejala & Tanda Umum</h4>
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
                        <h4 className="text-sm font-black uppercase tracking-widest">Target Nutrisi Harian</h4>
                      </div>
                      <p className="text-lg font-bold text-[var(--text-main)] leading-relaxed">
                        {selectedCondition.nutritionalTargets}
                      </p>
                    </div>

                    {/* References */}
                    <div className="space-y-4 pt-12 border-t border-[var(--border-card)]">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="text-[var(--text-muted)]" size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Referensi & Validasi Medis</h4>
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
                  Selesai Membaca
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
