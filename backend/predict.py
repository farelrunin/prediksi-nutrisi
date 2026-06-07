import os
import sys
import json
import csv
import numpy as np
from pathlib import Path
from PIL import Image

# Suppress TensorFlow logging
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# Import tensorflow after suppressing warnings to keep output clean
import tensorflow as tf

# Paths
BASE_DIR = Path(__file__).parent
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "best_nutrivision_cnn_food101_akg.keras"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.json"
NUTRITION_CSV = MODEL_DIR / "nutrition_table_cleaned.csv"

# Custom Keras Objects stub
@tf.keras.utils.register_keras_serializable(package="NutriVision")
class WeightedNutritionMAELoss(tf.keras.losses.Loss):
    def __init__(self, nutrient_weights=None, **kwargs):
        super().__init__(**kwargs)
        self.nutrient_weights = nutrient_weights or [1.0] * 8

    def call(self, y_true, y_pred):
        return tf.reduce_mean(tf.abs(y_true - y_pred))

    def get_config(self):
        config = super().get_config()
        config["nutrient_weights"] = self.nutrient_weights
        return config


@tf.keras.utils.register_keras_serializable(package="NutriVision")
class NutritionFromClassProbability(tf.keras.layers.Layer):
    def __init__(self, nutrition_table_norm=None, **kwargs):
        super().__init__(**kwargs)
        self.nutrition_table_norm = nutrition_table_norm or []
        self.dummy_weight = None

    def build(self, input_shape):
        self.dummy_weight = self.add_weight(
            name="dummy_weight",
            shape=(101, 8),
            initializer="zeros",
            trainable=False
        )
        super().build(input_shape)

    def call(self, inputs):
        return inputs

    def get_config(self):
        config = super().get_config()
        config["nutrition_table_norm"] = self.nutrition_table_norm
        return config


def run_prediction(image_path, model_classifier, class_names, nutrition_table):
    if not os.path.exists(image_path):
        print(json.dumps({"error": True, "message": f"Image path '{image_path}' does not exist."}), flush=True)
        return

    try:
        # Preprocess Image
        img = Image.open(image_path).convert("RGB")
        img = img.resize((224, 224), Image.Resampling.LANCZOS)
        arr = np.array(img, dtype=np.float32)  # Raw pixel [0, 255]
        img_array = np.expand_dims(arr, axis=0)

        # Predict
        predictions = model_classifier.predict(img_array, verbose=0)
        pred_probs = predictions[0]

        top_idx = int(np.argmax(pred_probs))
        top_confidence = float(pred_probs[top_idx])
        predicted_class = class_names[top_idx]

        # Check OOD Threshold
        OOD_THRESHOLD = 0.15
        if top_confidence < OOD_THRESHOLD:
            print(json.dumps({
                "error": True,
                "message": f"Model tidak dapat mengenali makanan ini dengan cukup yakin (confidence: {top_confidence*100:.1f}%). Pastikan gambar menampilkan makanan dengan jelas."
            }), flush=True)
            return

        # Get Nutrition
        nutrition = nutrition_table.get(predicted_class, {
            "calories_kcal": 250.0,
            "protein_g": 8.0,
            "carbs_g": 30.0,
            "fat_g": 10.0,
        })

        # Format Class Name
        display_name = predicted_class.replace("_", " ").title()

        top3_indices = np.argsort(pred_probs)[::-1][:3]
        top3 = [
            {
                "class": class_names[i],
                "label": class_names[i].replace("_", " ").title(),
                "confidence": round(float(pred_probs[i]) * 100, 2)
            }
            for i in top3_indices
        ]

        result = {
            "makanan": display_name,
            "food_name": display_name,
            "class_name": predicted_class,
            "confidence_persen": round(top_confidence * 100, 2),
            "confidence": round(top_confidence, 4),
            "estimasi_nutrisi": {
                "calories_kcal": round(nutrition["calories_kcal"], 1),
                "protein_g":     round(nutrition["protein_g"], 1),
                "carbs_g":       round(nutrition["carbs_g"], 1),
                "fat_g":         round(nutrition["fat_g"], 1),
            },
            "calories": round(nutrition["calories_kcal"], 1),
            "protein":  round(nutrition["protein_g"], 1),
            "carbs":    round(nutrition["carbs_g"], 1),
            "fat":      round(nutrition["fat_g"], 1),
            "top3_predictions": top3,
            "is_mock": False,
            "error": False
        }

        print(json.dumps(result), flush=True)

    except Exception as e:
        print(json.dumps({"error": True, "message": f"Error during prediction: {str(e)}"}), flush=True)


def main():
    try:
        # Load classes
        with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
            class_names = json.load(f)

        # Load nutrition CSV
        nutrition_table = {}
        with open(NUTRITION_CSV, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                nutrition_table[row["class_name"]] = {
                    "calories_kcal": float(row.get("calories_kcal", 0)),
                    "protein_g":     float(row.get("protein_g", 0)),
                    "carbs_g":       float(row.get("carbs_g", 0)),
                    "fat_g":         float(row.get("fat_g", 0)),
                }

        # Load Model
        full_model = tf.keras.models.load_model(
            str(MODEL_PATH),
            custom_objects={
                "WeightedNutritionMAELoss": WeightedNutritionMAELoss,
                "NutritionFromClassProbability": NutritionFromClassProbability,
            },
            compile=False
        )

        # Extract classifier layer
        class_output_layer = None
        for layer in full_model.layers:
            if "class_output" in layer.name or (
                hasattr(layer, 'output_shape') and 
                len(layer.output_shape) > 0 and 
                layer.output_shape[-1] == len(class_names)
            ):
                class_output_layer = layer
                break

        if class_output_layer is not None:
            model_classifier = tf.keras.Model(
                inputs=full_model.input,
                outputs=class_output_layer.output
            )
        else:
            model_classifier = tf.keras.Model(
                inputs=full_model.input,
                outputs=full_model.outputs[0]
            )

        # Check if single run or daemon mode
        if len(sys.argv) >= 2:
            # Single prediction mode
            run_prediction(sys.argv[1], model_classifier, class_names, nutrition_table)
        else:
            # Daemon mode
            print("READY", flush=True)
            for line in sys.stdin:
                image_path = line.strip()
                if not image_path:
                    continue
                if image_path == "EXIT":
                    break
                run_prediction(image_path, model_classifier, class_names, nutrition_table)

    except Exception as e:
        print(json.dumps({"error": True, "message": f"Startup Error: {str(e)}"}), flush=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
