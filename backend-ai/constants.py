# ==============================================================================
# NUTRIAI CONSTANTS & DATABASE MAPPING
# ==============================================================================

# Daftar nama kelas makanan (30 Kelas untuk mendukung model kustom baru)
# Cocokkan urutan list ini dengan urutan indeks output model tim AI kamu!
CLASS_NAMES = [
    "Ayam Goreng", "Nasi Goreng", "Telur Mata Sapi", "Mie Instan", "Sayur Sop",
    "Bakso", "Sate Ayam", "Rendang", "Gado-Gado", "Nasi Uduk",
    "Bubur Ayam", "Soto Ayam", "Tempe Goreng", "Tahu Goreng", "Martabak Manis",
    "Martabak Telur", "Siomay", "Pempek", "Batagor", "Pecel Lele",
    "Kari Ayam", "Capcay", "Sapi Lada Hitam", "Omelet", "Nasi Putih",
    "Pisang Goreng", "Roti Bakar", "Bubur Kacang Hijau", "Gulai Kambing", "Sop Buntut"
]

# Database gizi makanan lokal untuk mapping otomatis hasil prediksi klasifikasi
NUTRITION_DATABASE = {
    "Ayam Goreng": {"calories": 260.0, "protein": 25.0, "carbs": 0.0, "fat": 17.0},
    "Nasi Goreng": {"calories": 350.0, "protein": 7.0, "carbs": 45.0, "fat": 15.0},
    "Telur Mata Sapi": {"calories": 90.0, "protein": 6.5, "carbs": 0.6, "fat": 7.0},
    "Mie Instan": {"calories": 380.0, "protein": 8.0, "carbs": 54.0, "fat": 14.0},
    "Sayur Sop": {"calories": 80.0, "protein": 2.0, "carbs": 12.0, "fat": 2.0},
    "Bakso": {"calories": 302.0, "protein": 15.3, "carbs": 14.8, "fat": 18.2},
    "Sate Ayam": {"calories": 225.0, "protein": 21.0, "carbs": 8.5, "fat": 12.0},
    "Rendang": {"calories": 468.0, "protein": 28.0, "carbs": 9.5, "fat": 35.0},
    "Gado-Gado": {"calories": 318.0, "protein": 10.5, "carbs": 25.2, "fat": 20.4},
    "Nasi Uduk": {"calories": 260.0, "protein": 5.4, "carbs": 40.0, "fat": 8.5},
    "Bubur Ayam": {"calories": 165.0, "protein": 7.2, "carbs": 28.0, "fat": 2.8},
    "Soto Ayam": {"calories": 312.0, "protein": 18.5, "carbs": 22.0, "fat": 15.0},
    "Tempe Goreng": {"calories": 118.0, "protein": 10.0, "carbs": 9.0, "fat": 5.5},
    "Tahu Goreng": {"calories": 97.0, "protein": 8.6, "carbs": 3.0, "fat": 6.2},
    "Martabak Manis": {"calories": 347.0, "protein": 7.5, "carbs": 52.0, "fat": 12.0},
    "Martabak Telur": {"calories": 431.0, "protein": 18.0, "carbs": 28.5, "fat": 27.0},
    "Siomay": {"calories": 186.0, "protein": 12.0, "carbs": 20.0, "fat": 6.8},
    "Pempek": {"calories": 240.0, "protein": 11.5, "carbs": 36.0, "fat": 5.2},
    "Batagor": {"calories": 290.0, "protein": 9.8, "carbs": 28.0, "fat": 15.5},
    "Pecel Lele": {"calories": 250.0, "protein": 19.0, "carbs": 0.0, "fat": 19.5},
    "Kari Ayam": {"calories": 460.0, "protein": 24.5, "carbs": 18.0, "fat": 32.0},
    "Capcay": {"calories": 120.0, "protein": 6.0, "carbs": 14.5, "fat": 4.8},
    "Sapi Lada Hitam": {"calories": 380.0, "protein": 26.0, "carbs": 12.0, "fat": 25.0},
    "Omelet": {"calories": 154.0, "protein": 12.6, "carbs": 1.2, "fat": 11.0},
    "Nasi Putih": {"calories": 130.0, "protein": 2.7, "carbs": 28.0, "fat": 0.3},
    "Pisang Goreng": {"calories": 252.0, "protein": 2.0, "carbs": 36.5, "fat": 11.2},
    "Roti Bakar": {"calories": 285.0, "protein": 6.0, "carbs": 42.0, "fat": 10.5},
    "Bubur Kacang Hijau": {"calories": 180.0, "protein": 6.2, "carbs": 34.0, "fat": 2.5},
    "Gulai Kambing": {"calories": 510.0, "protein": 29.0, "carbs": 10.0, "fat": 38.0},
    "Sop Buntut": {"calories": 420.0, "protein": 27.5, "carbs": 15.0, "fat": 28.0}
}
