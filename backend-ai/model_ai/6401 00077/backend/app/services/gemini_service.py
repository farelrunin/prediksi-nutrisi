import os
import json
import time
from google import genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

try:
    if GEMINI_API_KEY:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        print("Gemini API aktif.")
    else:
        gemini_client = None
        print("GEMINI_API_KEY belum ditemukan.")
except Exception as e:
    gemini_client = None
    print("Gemini gagal diinisialisasi:", e)


def generate_local_recommendation(prediction_result, comparison_data):
    food_name = prediction_result["makanan"]

    low_nutrients = []

    for item in comparison_data:
        if item["percent_of_daily_need"] < 20:
            low_nutrients.append(item["nutrient"])

    text = f"Makanan yang terdeteksi adalah {food_name}. "

    if low_nutrients:
        text += (
            "Beberapa nutrisi dari makanan ini masih berkontribusi rendah terhadap "
            "kebutuhan harian, seperti "
            + ", ".join(low_nutrients).replace("_", " ")
            + ". "
        )

    text += (
        "Untuk melengkapi asupan hari ini, pengguna dapat menambahkan makanan tinggi "
        "protein seperti telur, ayam, ikan, tahu, atau tempe, serta menambahkan sayur "
        "dan buah untuk membantu memenuhi serat, kalsium, zat besi, dan vitamin C. "
        "Hasil ini hanya estimasi dan bukan pengganti saran ahli gizi atau dokter."
    )

    return text


def generate_gemini_recommendation(
    user_profile,
    prediction_result,
    akg_target,
    comparison_data,
    max_retry=3
):
    local_fallback = generate_local_recommendation(
        prediction_result=prediction_result,
        comparison_data=comparison_data
    )

    if gemini_client is None:
        return local_fallback

    prompt = f"""
Kamu adalah asisten rekomendasi gizi untuk aplikasi NutriVision.

Gunakan bahasa Indonesia yang mudah dipahami.

Batasan:
- Hasil prediksi makanan dan gizi hanya estimasi.
- Jangan memberikan diagnosis medis.
- Jangan menyarankan diet ekstrem.
- Jangan mengklaim hasil sebagai kebenaran mutlak.
- Berikan rekomendasi yang praktis, aman, dan cocok untuk pengguna umum.

Profil pengguna:
{json.dumps(user_profile, indent=2, ensure_ascii=False)}

Hasil prediksi makanan:
{json.dumps(prediction_result, indent=2, ensure_ascii=False)}

Target AKG harian pengguna:
{json.dumps(akg_target, indent=2, ensure_ascii=False)}

Perbandingan nutrisi terhadap AKG:
{json.dumps(comparison_data, indent=2, ensure_ascii=False)}

Tugas:
1. Jelaskan makanan yang terdeteksi dan confidence model.
2. Ringkas kandungan nutrisi utama.
3. Jelaskan nutrisi yang kontribusinya masih rendah.
4. Berikan rekomendasi makanan/minuman berikutnya.
5. Berikan 3 contoh menu sederhana.
6. Akhiri dengan catatan bahwa ini hanya estimasi dan bukan pengganti saran ahli gizi/dokter.
"""

    for attempt in range(max_retry):
        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            if response.text:
                return response.text.strip()

        except Exception as e:
            error_message = str(e)

            if "503" in error_message or "UNAVAILABLE" in error_message:
                time.sleep(2 * (attempt + 1))
                continue

            return local_fallback + f"\n\nCatatan sistem: Gemini gagal digunakan ({error_message})."

    return local_fallback + "\n\nCatatan sistem: Gemini sedang ramai, sehingga rekomendasi dibuat menggunakan sistem lokal."