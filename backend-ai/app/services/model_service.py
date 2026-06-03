import io
import json
import os
import numpy as np
import pandas as pd
from PIL import Image
# pyrefly: ignore [missing-import]
import keras

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "artifacts", "best_nutrivision_cnn_food101_akg.keras")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "artifacts", "class_names.json")
NUTRITION_TABLE_PATH = os.path.join(BASE_DIR, "artifacts", "nutrition_table_cleaned.csv")


@keras.saving.register_keras_serializable(
    package="NutriVision",
    name="NutritionFromClassProbability"
)
class NutritionFromClassProbability(keras.layers.Layer):
    def __init__(self, nutrition_table_norm, **kwargs):
        super().__init__(**kwargs)
        self.nutrition_table_norm = np.array(nutrition_table_norm, dtype="float32")

    def build(self, input_shape):
        self.nutrition_table = self.add_weight(
            name="nutrition_table",
            shape=self.nutrition_table_norm.shape,
            initializer=keras.initializers.Constant(self.nutrition_table_norm),
            trainable=False,
        )
        super().build(input_shape)

    def call(self, class_probs):
        return keras.ops.matmul(class_probs, self.nutrition_table)

    def get_config(self):
        config = super().get_config()
        config.update({
            "nutrition_table_norm": self.nutrition_table_norm.tolist()
        })
        return config

    @classmethod
    def from_config(cls, config):
        nutrition_table_norm = config.pop("nutrition_table_norm")
        return cls(nutrition_table_norm=nutrition_table_norm, **config)


keras.saving.get_custom_objects()["NutritionFromClassProbability"] = NutritionFromClassProbability
keras.saving.get_custom_objects()["NutriVision>NutritionFromClassProbability"] = NutritionFromClassProbability


import zipfile
import tempfile
import shutil

def fix_keras_model(model_path):
    try:
        temp_dir = tempfile.mkdtemp()
        fixed_model_path = os.path.join(temp_dir, "fixed_model.keras")
        
        with zipfile.ZipFile(model_path, 'r') as zip_in:
            with zipfile.ZipFile(fixed_model_path, 'w') as zip_out:
                for item in zip_in.infolist():
                    data = zip_in.read(item.filename)
                    if item.filename == "config.json":
                        config = json.loads(data.decode('utf-8'))
                        
                        def remove_quantization(obj):
                            if isinstance(obj, dict):
                                if "quantization_config" in obj:
                                    del obj["quantization_config"]
                                for k, v in list(obj.items()):
                                    remove_quantization(v)
                            elif isinstance(obj, list):
                                for item in obj:
                                    remove_quantization(item)
                        
                        remove_quantization(config)
                        data = json.dumps(config).encode('utf-8')
                    
                    zip_out.writestr(item, data)
        return fixed_model_path
    except Exception as e:
        print(f"[WARNING] Failed to patch model Keras config: {e}")
        return model_path


patched_model_path = fix_keras_model(MODEL_PATH)
model = keras.models.load_model(
    patched_model_path,
    compile=False,
    safe_mode=False
)

# Clean up temporary patched file directory
if patched_model_path != MODEL_PATH:
    try:
        shutil.rmtree(os.path.dirname(patched_model_path))
    except Exception:
        pass

with open(CLASS_NAMES_PATH, "r") as f:
    CLASS_NAMES = json.load(f)

nutrition_df = pd.read_csv(NUTRITION_TABLE_PATH)

DEFAULT_DENORM_SCALE = {
    "calories_kcal": 1000.0,
    "protein_g": 100.0,
    "carbs_g": 160.0,
    "fat_g": 100.0,
    "fiber_g": 50.0,
    "calcium_mg": 1600.0,
    "iron_mg": 30.0,
    "vitamin_c_mg": 200.0,
}


def predict_food_image(image_bytes: bytes, porsi_gram: float = 100.0):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_resized = img.resize((224, 224))

    batch = np.expand_dims(
        np.array(img_resized, dtype="float32"),
        axis=0
    )

    outputs = model.predict(batch, verbose=0)

    nutrition_norm = None
    if isinstance(outputs, dict):
        class_probs = outputs["class_output"][0]
        nutrition_norm = outputs.get("nutrition_output", [None])[0]
    else:
        # Keras model outputs are [nutrition_output (shape 8), class_output (shape 101)]
        # We dynamically select the one matching the length of CLASS_NAMES
        if outputs[0].shape[-1] == len(CLASS_NAMES):
            class_probs = outputs[0][0]
            nutrition_norm = outputs[1][0] if len(outputs) > 1 else None
        else:
            class_probs = outputs[1][0]
            nutrition_norm = outputs[0][0] if len(outputs) > 1 else None

    class_probs = np.asarray(class_probs, dtype=np.float32)
    if nutrition_norm is not None:
        nutrition_norm = np.asarray(nutrition_norm, dtype=np.float32)

    top_indices = np.argsort(class_probs)[::-1][:5]
    pred_idx = int(top_indices[0])
    pred_class = CLASS_NAMES[pred_idx]
    confidence = float(class_probs[pred_idx])

    # --- Out-of-Distribution (OOD) Protection ---
    confidence_persen = round(confidence * 100, 2)

    # 1. Absolute Threshold Filter (Keyakinan Mutlak)
    if confidence < 0.35:
        return {
            "error": True,
            "message": "Gambar tidak dikenali sebagai makanan. Silakan ambil foto makanan dengan lebih jelas.",
            "confidence_persen": confidence_persen
        }

    # 2. Margin of Confidence Filter (Ragu/Guessing)
    second_pred_idx = int(top_indices[1])
    second_confidence = float(class_probs[second_pred_idx])
    margin = confidence - second_confidence

    if margin < 0.10:
        return {
            "error": True,
            "message": "Gambar kurang jelas atau model ragu mendeteksi jenis makanan ini. Silakan unggah foto makanan dengan lebih fokus.",
            "confidence_persen": confidence_persen,
            "margin_persen": round(margin * 100, 2)
        }

    row = nutrition_df[nutrition_df["class_name"] == pred_class]

    if row.empty:
        raise ValueError(f"Data nutrisi untuk kelas '{pred_class}' tidak ditemukan.")

    nutrisi_100g = row.iloc[0]
    rasio = porsi_gram / 100.0

    nutrition_data = {
        "calories_kcal": round(float(nutrisi_100g["calories_kcal"]) * rasio, 2),
        "protein_g": round(float(nutrisi_100g["protein_g"]) * rasio, 2),
        "carbs_g": round(float(nutrisi_100g["carbs_g"]) * rasio, 2),
        "fat_g": round(float(nutrisi_100g["fat_g"]) * rasio, 2),
        "fiber_g": round(float(nutrisi_100g.get("fiber_g", 0)) * rasio, 2),
        "calcium_mg": round(float(nutrisi_100g.get("calcium_mg", 0)) * rasio, 2),
        "iron_mg": round(float(nutrisi_100g.get("iron_mg", 0)) * rasio, 2),
        "vitamin_c_mg": round(float(nutrisi_100g.get("vitamin_c_mg", 0)) * rasio, 2),
    }

    # Denormalisasi estimasi gizi dari output neural network model
    model_nutrition_data = None
    if nutrition_norm is not None:
        model_nutrition_data = {}
        nutrient_order = [
            "calories_kcal", "protein_g", "carbs_g", "fat_g",
            "fiber_g", "calcium_mg", "iron_mg", "vitamin_c_mg"
        ]
        for i, col in enumerate(nutrient_order):
            scale = DEFAULT_DENORM_SCALE.get(col, 1.0)
            val = float(nutrition_norm[i]) * scale * rasio
            model_nutrition_data[col] = round(val, 2)

    top_predictions = [
        {
            "class_name": CLASS_NAMES[int(i)],
            "confidence_persen": round(float(class_probs[int(i)]) * 100, 2)
        }
        for i in top_indices
    ]

    return {
        "makanan": pred_class.replace("_", " ").title(),
        "class_name": pred_class,
        "confidence_persen": round(confidence * 100, 2),
        "top_predictions": top_predictions,
        "estimasi_nutrisi": nutrition_data,
        "estimasi_nutrisi_model": model_nutrition_data
    }