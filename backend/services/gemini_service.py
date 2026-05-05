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
    Menggunakan Gemini untuk mengekstrak nama makanan dan kuantitas dari teks bebas.
    Contoh: 'Tadi pagi saya makan 2 piring nasi goreng' -> {'food': 'nasi goreng', 'quantity': 2, 'unit': 'piring'}
    """
    if not model:
        return None

    prompt = f"""
    Ekstrak informasi makanan dari teks berikut: "{text}"
    Berikan jawaban HANYA dalam format JSON mentah seperti ini: 
    {{"food_name": "nama makanan", "quantity": angka, "unit": "satuan"}}
    Jika tidak ada informasi jumlah, gunakan quantity: 1 dan unit: "porsi".
    Jika teks tidak mengandung nama makanan, kembalikan JSON kosong {{}}.
    """

    try:
        response = model.generate_content(prompt)
        # Bersihkan output dari markdown code blocks jika ada
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        import json
        return json.loads(clean_text)
    except Exception as e:
        print(f"Error parsing text with Gemini: {e}")
        return None
