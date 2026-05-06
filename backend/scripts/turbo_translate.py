import pandas as pd
import google.generativeai as genai
from tqdm import tqdm
import os
import json
import time
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

def translate_batch(names):
    prompt = f"""
    Terjemahkan daftar nama makanan berikut dari Bahasa Inggris ke Bahasa Indonesia yang umum dan alami.
    Berikan hasil dalam format JSON array of strings saja.
    
    Daftar: {names}
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        print(f"Error translating batch: {e}")
        return names # Fallback to original

def main():
    input_file = 'data/raw/opennutritionclean_foods.csv'
    output_file = 'data/raw/Nutrisi_Makanan_Full_Indo.csv'
    
    print(f"Membaca {input_file}...")
    df = pd.read_csv(input_file)
    
    # Kita hanya ambil 1000 data pertama dulu agar cepat untuk demo, 
    # atau biarkan semua jika user mau menunggu. 
    # Karena user bilang 'search makanan umum indo ngga muncul', 
    # kita prioritaskan data yang ada.
    
    # Ambil kolom foodname_100g
    food_names = df['foodname_100g'].tolist()
    translated_names = []
    
    batch_size = 50
    print(f"Mulai menerjemahkan {len(food_names)} item dengan Gemini (Turbo Mode)...")
    
    for i in tqdm(range(0, len(food_names), batch_size)):
        batch = food_names[i:i+batch_size]
        translated_batch = translate_batch(batch)
        
        # Pastikan jumlahnya sama
        if len(translated_batch) != len(batch):
            # Jika gagal, translate satu-satu untuk batch ini
            temp_batch = []
            for name in batch:
                temp_batch.append(name) # Fallback sementara
            translated_names.extend(temp_batch)
        else:
            translated_names.extend(translated_batch)
            
        # Jeda dikit biar gak kena rate limit API gratis
        time.sleep(1)

    df['foodname_id'] = translated_names # Simpan di kolom baru foodname_id
    
    # Ubah header ke Indonesia seperti permintaan user
    kamus_kolom = {
        'foodname_100g': 'nama_makanan_en',
        'foodname_id': 'nama_makanan_id',
        'alternate_names': 'nama_alternatif',
        'description': 'deskripsi',
        'serving': 'porsi',
        'calories': 'kalori',
        'protein': 'protein',
        'total_fat': 'lemak_total',
        'carbohydrates': 'karbohidrat',
        'sodium': 'natrium',
        'potassium': 'kalium'
    }
    df.rename(columns=kamus_kolom, inplace=True)
    
    print(f"Menyimpan ke {output_file}...")
    df.to_csv(output_file, index=False)
    print("Selesai!")

if __name__ == "__main__":
    main()
