import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key and api_key != "isi_dengan_api_key_kamu_di_sini":
    genai.configure(api_key=api_key)
    # Update ke model terbaru yang tersedia di akunmu (Gemini 3)
    model = genai.GenerativeModel('gemini-3-flash-preview')
else:
    model = None

def get_ai_advice(food_data, user_profile):
    """
    Memberikan saran nutrisi personal berdasarkan makanan dan profil user menggunakan Gemini.
    """
    if not model:
        return "Saran AI belum tersedia (API Key belum dikonfigurasi)."

    # Buat prompt yang sangat spesifik (Teknik Prompt Engineering)
    prompt = f"""
    Bertindaklah sebagai Pakar Nutrisi Profesional Indonesia.
    User baru saja mencatat asupan makanan berikut:
    - Nama Makanan: {food_data.get('food_name')}
    - Kalori: {food_data.get('calories')} kkal
    - Protein: {food_data.get('protein')}g
    - Karbohidrat: {food_data.get('carbs')}g
    - Lemak: {food_data.get('fat')}g

    Profil User:
    - Jenis Kelamin: {user_profile.get('gender', 'Tidak disebutkan')}
    - Tinggi: {user_profile.get('height', '-')} cm
    - Berat: {user_profile.get('weight', '-')} kg
    - Catatan Kesehatan: {user_profile.get('healthNotes', 'Tidak ada')}
    - Tujuan: {user_profile.get('nutritionGoal', 'Menjaga kesehatan')}

    Berikan analisis singkat (maksimal 3 kalimat) dalam Bahasa Indonesia yang santun tentang:
    1. Apakah makanan ini cocok dengan profil/tujuan mereka?
    2. Satu saran perbaikan atau tips sehat terkait makanan tersebut.
    """

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return "Sedang tidak dapat menghubungi asisten AI saat ini."

def get_ai_recommendations(history_data: list, profile_data: dict):
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    prompt = f"""
    Anda adalah ahli gizi AI profesional. Berdasarkan data riwayat makan dan profil user berikut, berikan 3 rekomendasi nutrisi yang sangat personal dan spesifik.
    
    PROFIL USER:
    - Umur: {profile_data.get('age')}
    - Berat: {profile_data.get('weight')}kg
    - Tinggi: {profile_data.get('height')}cm
    - Aktivitas: {profile_data.get('activityLevel')}
    - Kondisi: {', '.join(profile_data.get('conditions', []))}
    
    RIWAYAT MAKAN TERAKHIR (10 entri):
    {history_data[:10]}
    
    TUGAS:
    Berikan 3 rekomendasi dalam format JSON murni (array of objects).
    Setiap objek harus memiliki:
    1. priority: 'high', 'medium', atau 'low'
    2. title: Judul singkat (max 5 kata)
    3. message: Penjelasan detail kenapa rekomendasi ini diberikan (2-3 kalimat)
    4. foods: Daftar makanan saran (array of strings, 4-6 item)
    5. type: kategori (protein, iron, calcium, fiber, dsb)
    
    FORMAT OUTPUT HARUS JSON MURNI TANPA MARKDOWN:
    [
      {{"priority": "high", "title": "...", "message": "...", "foods": ["...", "..."], "type": "..."}},
      ...
    ]
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        import json
        return json.loads(text)
    except Exception as e:
        print(f"Error Gemini Recommendations: {e}")
        return []

def parse_natural_language_food(text):
    """
    Menggunakan Gemini untuk mengekstrak seluruh makanan, porsi, dan estimasi makronutrien dari teks bebas.
    """
    if not model:
        return None

    prompt = f"""
    Anda adalah sistem ekstraksi data nutrisi cerdas. Pengguna menceritakan apa yang mereka makan:
    "{text}"

    Tugas Anda adalah mengekstrak semua item makanan dan minumannya. 
    Lakukan estimasi realistis berdasarkan standar nutrisi umum Indonesia.
    Abaikan curhatan/cerita yang tidak terkait makanan.
    Bumbu mi instan yang dituang semua berarti tinggi sodium/lemak, sesuaikan kalori/lemaknya.
    Es teh manis jumbo berarti tinggi gula/karbohidrat.

    Berikan HANYA JSON MURNI (tanpa markdown, tanpa prefix/suffix). 
    Format JSON yang WAJIB dipatuhi:
    {{
        "parsed_foods": [
            {{
                "name": "Nama makanan yang ramah (misal: Mi Instan Goreng)",
                "normalized_name": "mi instan",
                "quantity": 1.0,
                "unit": "bungkus",
                "portion": "1 bungkus",
                "estimated_grams": 85.0,
                "nutrition": {{
                    "calories": 400.0,
                    "protein": 8.0,
                    "carbs": 55.0,
                    "fat": 15.0,
                    "unit": "per porsi"
                }}
            }}
        ],
        "total_nutrition": {{
            "calories": 400.0,
            "protein": 8.0,
            "carbs": 55.0,
            "fat": 15.0,
            "quantity_grams": 85.0
        }},
        "original_story": "{text}"
    }}
    Hitung total_nutrition dengan benar (jumlah semua nutrisi di parsed_foods). Jika tidak ada makanan, biarkan list kosong dan total 0.
    """

    try:
        response = model.generate_content(prompt)
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        import json
        return json.loads(clean_text)
    except Exception as e:
        print(f"Error parsing text with Gemini: {e}")
        return None
