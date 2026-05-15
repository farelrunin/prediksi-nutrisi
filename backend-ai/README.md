# NutriAI - Backend AI (FastAPI)

Folder ini khusus untuk Tim AI mengerjakan **Main Quest** dan **Side Quest**.

## Tugas Tim AI:
1.  **Main Quest:** Masukkan model TensorFlow kalian (.h5 atau .keras) ke folder ini.
2.  **Inference:** Edit file `main.py` untuk memuat model dan melakukan prediksi pada fungsi `/predict`.
3.  **Side Quest:** Pastikan API ini bisa diakses oleh Tim Fullstack melalui HTTP Request.

## Cara Menjalankan (Lokal):
1.  Install Python 3.10+
2.  Install dependencies: `pip install -r requirements.txt`
3.  Jalankan server: `python main.py` atau `uvicorn main:app --reload`
4.  Buka dokumentasi otomatis di: `http://localhost:8000/docs`

## Struktur Response yang Dibutuhkan Fullstack:
Mohon kembalikan JSON dalam format:
```json
{
    "food_name": "Nama Makanan",
    "calories": 250.0,
    "protein": 20.0,
    "carbs": 30.0,
    "fat": 10.0,
    "confidence": 0.95
}
```
