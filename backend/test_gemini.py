import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"Mencoba koneksi dengan API Key: {api_key[:5]}...{api_key[-5:] if api_key else ''}")

if not api_key or api_key == "isi_dengan_api_key_kamu_di_sini":
    print("ERROR: API Key masih pakai contoh (default). Tolong ganti di file .env")
else:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Cek koneksi, jawab dengan 'OKE' saja.")
        print(f"HASIL: {response.text}")
        print("Koneksi Gemini BERHASIL! 🎉")
    except Exception as e:
        print(f"Koneksi Gemini GAGAL! ❌")
        print(f"Pesan Error: {str(e)}")
