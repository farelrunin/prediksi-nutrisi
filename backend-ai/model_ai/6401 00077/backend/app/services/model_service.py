import io
import json
import numpy as np
import pandas as pd
from PIL import Image
import keras

MODEL_PATH = "artifacts/best_nutrivision_cnn_food101_akg.keras"
CLASS_NAMES_PATH = "artifacts/class_names.json"
NUTRITION_TABLE_PATH = "artifacts/nutrition_table_cleaned.csv"


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


model = keras.models.load_model(
    MODEL_PATH,
    compile=False,
    safe_mode=False
)

with open(CLASS_NAMES_PATH, "r") as f:
    CLASS_NAMES = json.load(f)

nutrition_df = pd.read_csv(NUTRITION_TABLE_PATH)


def predict_food_image(image_bytes: bytes, porsi_gram: float = 100.0):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_resized = img.resize((224, 224))

    batch = np.expand_dims(
        np.array(img_resized, dtype="float32"),
        axis=0
    )

    outputs = model.predict(batch, verbose=0)

    if isinstance(outputs, dict):
        class_probs = outputs["class_output"][0]
    else:
        class_probs = outputs[0][0]

    class_probs = np.asarray(class_probs, dtype=np.float32)

    top_indices = np.argsort(class_probs)[::-1][:5]
    pred_idx = int(top_indices[0])
    pred_class = CLASS_NAMES[pred_idx]
    confidence = float(class_probs[pred_idx])

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
        "estimasi_nutrisi": nutrition_data
    }