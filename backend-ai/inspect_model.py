import os
# pyrefly: ignore [missing-import]
import keras

MODEL_PATH = r"d:\DICODING\capstone\backend-ai\nutrition_food101_ram_safe 5140\nutrition_food101_ram_safe 5140\best_nutrivision_food101_ram_safe.keras"

print("Checking model path:", MODEL_PATH)
print("Exists:", os.path.exists(MODEL_PATH))

if os.path.exists(MODEL_PATH):
    try:
        # Load the model
        model = keras.models.load_model(MODEL_PATH)
        print("Success loading model!")
        print("Model Inputs:", model.inputs)
        print("Model Outputs:", model.outputs)
        model.summary()
    except Exception as e:
        print("Error loading model:", e)
