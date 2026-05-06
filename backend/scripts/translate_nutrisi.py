import pandas as pd
from deep_translator import GoogleTranslator
from tqdm import tqdm
import time
import os

def main():
    input_file = 'data/raw/opennutritionclean_foods.csv'
    output_file = 'data/raw/Nutrisi_Makanan_Full_Indo.csv'
    
    if not os.path.exists(input_file):
        print(f"File {input_file} tidak ditemukan!")
        return

    print("Membaca dataset...")
    df = pd.read_csv(input_file)
    
    # Inisialisasi translator
    translator = GoogleTranslator(source='en', target='id')
    
    # Kita akan menerjemahkan foodname_100g
    # Untuk mempercepat demo, kita batasi atau gunakan interval save
    print("Mulai menerjemahkan (Deep Translator - No API Key)...")
    
    # Kita hanya translate nama makanan saja (kolom foodname_100g)
    # Deskripsi dilewati saja agar tidak terlalu lama (sesuai saran di script user)
    
    translated_names = []
    
    # Gunakan subset untuk testing/keamanan waktu jika perlu, 
    # tapi kita coba jalankan secara efisien.
    for i, name in enumerate(tqdm(df['foodname_100g'])):
        try:
            # Jeda dikit biar gak di-ban Google
            if i % 10 == 0:
                time.sleep(0.1)
                
            trans = translator.translate(str(name))
            translated_names.append(trans)
        except Exception as e:
            translated_names.append(name) # Fallback
            
        # Save berkala setiap 500 baris agar aman
        if i % 500 == 0 and i > 0:
            df_temp = df.iloc[:len(translated_names)].copy()
            df_temp['nama_makanan_id'] = translated_names
            df_temp.to_csv(output_file + '.tmp', index=False)

    df['nama_makanan_id'] = translated_names
    
    # Rename columns sesuai permintaan
    kamus_kolom = {
        'foodname_100g': 'nama_makanan_en',
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
    
    df.to_csv(output_file, index=False)
    print(f"Selesai! Disimpan ke {output_file}")

if __name__ == "__main__":
    main()
