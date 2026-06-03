# ==============================================================================
# BLUEPRINT TRAINING MODEL TENSORFLOW FUNCTIONAL API — NUTRIAI
# ==============================================================================
# Halo Tim AI NutriAI! 🚀
# Ini adalah blueprint lengkap untuk membuat, melatih, mengevaluasi, dan mengekspor
# model klasifikasi gambar makanan menggunakan TensorFlow Functional API.
# 
# PANDUAN PENGGUNAAN:
# 1. Pastikan dataset makanan kalian sudah rapi di dalam sebuah folder terstruktur:
#    dataset/
#      ├── Ayam Goreng/
#      ├── Nasi Goreng/
#      ├── Telur Mata Sapi/
#      ... (dan kelas makanan lainnya)
# 2. Jalankan script ini: `python train_model.py`
# 3. Hasil akhirnya berupa file `model_nutriai.keras` yang langsung siap digunakan
#    oleh FastAPI server kita untuk memprediksi gizi secara lokal!
# ==============================================================================

import os
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# 1. KONFIGURASI PARAMETER UTAMA
DATASET_PATH = "dataset"      # Ganti dengan folder dataset asli kalian
IMAGE_SIZE = (224, 224)       # Ukuran standard MobileNetV2
BATCH_SIZE = 32
EPOCHS = 10                   # Sesuaikan dengan kekuatan GPU/CPU kalian
NUM_CLASSES = 5               # Ubah sesuai jumlah kelas makanan kalian

def create_model(input_shape, num_classes):
    """
    Membangun model Image Classification menggunakan TensorFlow Functional API.
    Menggunakan pretrained model MobileNetV2 untuk transfer learning berkinerja tinggi.
    """
    # Define Input Layer
    inputs = keras.Input(shape=input_shape, name="input_gambar")
    
    # 1. Preprocessing Layer (Normalisasi nilai pixel ke rentang [-1, 1] untuk MobileNetV2)
    # Ini opsional jika preprocessing sudah dilakukan di luar model.
    x = layers.Rescaling(1./127.5, offset=-1)(inputs)
    
    # 2. Augmentasi Gambar (Opsional tapi direkomendasikan biar model gak gampang overfitting)
    x = layers.RandomFlip("horizontal")(x)
    x = layers.RandomRotation(0.2)(x)
    x = layers.RandomZoom(0.1)(x)
    
    # 3. Pretrained Base Model (Transfer Learning)
    # Kita pakai MobileNetV2 karena ringan, cepat, dan sangat akurat untuk deployment.
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights="imagenet"
    )
    
    # Bekukan bobot base model agar tidak berubah saat awal training
    base_model.trainable = False
    
    # Hubungkan input dengan base model
    x = base_model(x, training=False)
    
    # 4. Head Layer (Klasifikasi baru)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x)            # Mencegah overfitting
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    
    # Output Layer (Softmax untuk multi-class classification)
    outputs = layers.Dense(num_classes, activation="softmax", name="output_klasifikasi")(x)
    
    # Bangun Model utuh menggunakan Functional API
    model = keras.Model(inputs=inputs, outputs=outputs, name="NutriAI_TensorFlow_Model")
    return model

def main():
    print("[INFO] Memulai Proses Training Model NutriAI...")
    
    # Simulasi pengecekan dataset
    if not os.path.exists(DATASET_PATH):
        print(f"[WARNING] Folder dataset '{DATASET_PATH}' tidak ditemukan!")
        print("TIPS: Buatlah folder dataset/ dengan subfolder nama kelas makanan untuk testing awal.")
        os.makedirs(DATASET_PATH, exist_ok=True)
        # Membuat folder dummy agar tim AI bisa langsung coba running tanpa error
        os.makedirs(os.path.join(DATASET_PATH, "Ayam Goreng"), exist_ok=True)
        os.makedirs(os.path.join(DATASET_PATH, "Nasi Goreng"), exist_ok=True)
        os.makedirs(os.path.join(DATASET_PATH, "Telur Mata Sapi"), exist_ok=True)
        os.makedirs(os.path.join(DATASET_PATH, "Mie Instan"), exist_ok=True)
        os.makedirs(os.path.join(DATASET_PATH, "Sayur Sop"), exist_ok=True)
        print("[INFO] Folder dataset dummy berhasil dibuat! Silakan taruh beberapa foto tes di dalamnya.")
    
    # 2. LOAD DATASET (Training & Validation Split)
    print("[INFO] Memuat dataset gambar...")
    train_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_PATH,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_PATH,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE
    )
    
    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"[SUCCESS] Kelas makanan terdeteksi ({num_classes} kelas): {class_names}")
    
    # Prefetch untuk mempercepat proses loading data ke GPU/CPU saat training
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)
    
    # 3. BUILD MODEL
    input_shape = IMAGE_SIZE + (3,) # (224, 224, 3)
    model = create_model(input_shape, num_classes)
    
    # Cetak ringkasan arsitektur model
    model.summary()
    
    # 4. COMPILE MODEL
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss=keras.losses.SparseCategoricalCrossentropy(),
        metrics=["accuracy"]
    )
    
    # 5. TRAINING MODEL
    print(f"[INFO] Memulai training selama {EPOCHS} epoch...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS
    )
    print("[SUCCESS] Training selesai!")
    
    # 6. EVALUASI MODEL
    print("[INFO] Mengevaluasi model di dataset validasi...")
    loss, accuracy = model.evaluate(val_ds)
    print(f"[RESULT] Hasil Evaluasi -> Loss: {loss:.4f}, Akurasi: {accuracy*100:.2f}%")
    
    # 7. EXPORT MODEL KE FORMAT .KERAS (Standard TensorFlow Terbaru)
    model_export_name = "model_nutriai.keras"
    print(f"[INFO] Mengekspor model ke format standard: '{model_export_name}'...")
    model.save(model_export_name)
    print(f"[SUCCESS] Model berhasil disimpan! Pindahkan file '{model_export_name}' tersebut ke folder 'backend-ai/' setelah ditrain.")

if __name__ == "__main__":
    main()
