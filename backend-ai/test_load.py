import os
# pyrefly: ignore [missing-import]
import keras
# pyrefly: ignore [missing-import]
from keras import layers

@keras.saving.register_keras_serializable(package="NutriVision")
class SqueezeExciteBlock(layers.Layer):
    def __init__(self, ratio=8, **kwargs):
        super().__init__(**kwargs)
        self.ratio = ratio

    def build(self, input_shape):
        channel = input_shape[-1]
        self.avg_pool = layers.GlobalAveragePooling2D(keepdims=True)
        self.fc1 = layers.Dense(channel // self.ratio, activation="relu", use_bias=False)
        self.fc2 = layers.Dense(channel, activation="sigmoid", use_bias=False)
        super().build(input_shape)

    def call(self, inputs):
        x = self.avg_pool(inputs)
        x = self.fc1(x)
        x = self.fc2(x)
        return inputs * x

    def get_config(self):
        config = super().get_config()
        config.update({"ratio": self.ratio})
        return config

print("Keras version:", keras.__version__)

MODEL_PATH = "nutrition5k_nutrivision_custom_model.keras"
if os.path.exists(MODEL_PATH):
    try:
        model = keras.models.load_model(MODEL_PATH)
        print("Success loading model!")
        model.summary()
    except Exception as e:
        print("Error loading model:", e)
else:
    print("Model path does not exist:", MODEL_PATH)
