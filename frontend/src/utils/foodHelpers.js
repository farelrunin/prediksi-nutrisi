import { 
  Squares2X2Icon, 
  FireIcon, 
  HeartIcon, 
  CakeIcon, 
  BoltIcon, 
  BeakerIcon, 
  SunIcon, 
  SparklesIcon, 
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';

export const getCategoryIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('protein')) return BeakerIcon;
  if (n.includes('buah') || n.includes('sayur')) return SunIcon;
  if (n.includes('sehat')) return HeartIcon;
  if (n.includes('jajanan') || n.includes('kafe')) return CakeIcon;
  if (n.includes('fast')) return BoltIcon;
  if (n.includes('instan')) return ShoppingBagIcon;
  if (n.includes('karbohidrat')) return SparklesIcon;
  if (n.includes('masakan')) return FireIcon;
  return Squares2X2Icon;
};

export const translateFoodToId = (name) => {
  if (!name) return '';
  let translated = name;
  
  const dict = [
    { en: /chicken breast/gi, id: 'Dada Ayam' },
    { en: /chicken drumstick/gi, id: 'Paha Bawah Ayam' },
    { en: /chicken thigh/gi, id: 'Paha Atas Ayam' },
    { en: /chicken/gi, id: 'Ayam' },
    { en: /scrambled eggs/gi, id: 'Telur Orak-Arik' },
    { en: /hard-boiled eggs/gi, id: 'Telur Rebus Matang' },
    { en: /fried egg/gi, id: 'Telur Goreng' },
    { en: /eggs/gi, id: 'Telur' },
    { en: /egg/gi, id: 'Telur' },
    { en: /white rice/gi, id: 'Nasi Putih' },
    { en: /brown rice/gi, id: 'Nasi Merah' },
    { en: /cooked rice/gi, id: 'Nasi Masak' },
    { en: /jasmine rice/gi, id: 'Nasi Melati' },
    { en: /rice/gi, id: 'Nasi' },
    { en: /whole milk/gi, id: 'Susu Murni (Whole Milk)' },
    { en: /reduced-fat milk/gi, id: 'Susu Rendah Lemak' },
    { en: /soy milk/gi, id: 'Susu Kedelai' },
    { en: /milk/gi, id: 'Susu' },
    { en: /banana/gi, id: 'Pisang' },
    { en: /apple/gi, id: 'Apel' },
    { en: /mango/gi, id: 'Mangga' },
    { en: /orange/gi, id: 'Jeruk' },
    { en: /potato/gi, id: 'Kentang' },
    { en: /onion/gi, id: 'Bawang Bombay' },
    { en: /garlic/gi, id: 'Bawang Putih' },
    { en: /beef/gi, id: 'Daging Sapi' },
    { en: /pork/gi, id: 'Daging Babi' },
    { en: /fish/gi, id: 'Ikan' },
    { en: /tuna/gi, id: 'Ikan Tuna' },
    { en: /salmon/gi, id: 'Ikan Salmon' },
    { en: /shrimp/gi, id: 'Udang' },
    { en: /bread/gi, id: 'Roti' },
    { en: /oatmeal/gi, id: 'Havermut (Oatmeal)' },
    { en: /oats/gi, id: 'Gandum Oat' },
    { en: /flour/gi, id: 'Tepung' },
    { en: /water/gi, id: 'Air' },
    { en: /cheese/gi, id: 'Keju' },
    { en: /butter/gi, id: 'Mentega' },
    { en: /noodle/gi, id: 'Mie' },
    { en: /cereal/gi, id: 'Sereal' },
    { en: /boneless skinless/gi, id: 'Tanpa Tulang & Kulit' },
    { en: /boneless/gi, id: 'Tanpa Tulang' },
    { en: /cooked/gi, id: 'Matang' },
    { en: /raw/gi, id: 'Mentah' },
    { en: /sweet potatoes/gi, id: 'Ubi Jalar' },
    { en: /canned/gi, id: 'Kalengan' },
    { en: /sliced/gi, id: 'Irisan' },
    { en: /spicy/gi, id: 'Pedas' },
    { en: /sauce/gi, id: 'Saus' },
    { en: /salad/gi, id: 'Salad' },
    { en: /soup/gi, id: 'Sup' },
    { en: /vegetable/gi, id: 'Sayur' },
    { en: /fruit/gi, id: 'Buah' },
    { en: /sugar/gi, id: 'Gula' },
    { en: /salt/gi, id: 'Garam' },
    { en: /oil/gi, id: 'Minyak' },
    { en: /honey/gi, id: 'Madu' },
    { en: /yogurt/gi, id: 'Yoghurt' },
    { en: /juice/gi, id: 'Jus' },
    { en: /tea/gi, id: 'Teh' },
    { en: /coffee/gi, id: 'Kopi' },
    { en: /chocolate/gi, id: 'Cokelat' },
    { en: /bean/gi, id: 'Kacang' },
    { en: /nut/gi, id: 'Kacang' },
    { en: /tomato/gi, id: 'Tomat' },
    { en: /chili/gi, id: 'Cabai' }
  ];

  dict.forEach(rule => {
    translated = translated.replace(rule.en, rule.id);
  });
  
  return translated;
};
