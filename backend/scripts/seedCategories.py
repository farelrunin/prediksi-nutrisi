import os
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from database import engine, SessionLocal, Base
from models import Category

Base.metadata.create_all(bind=engine)

CATEGORIES = [
    {"name": "Protein", "section": "Bahan & Nutrisi", "description": "Sumber protein dan olahan bergizi untuk kebutuhan harian."},
    {"name": "Buah-buahan", "section": "Bahan & Nutrisi", "description": "Pilihan buah segar dan olahan kaya vitamin."},
    {"name": "Sayuran", "section": "Bahan & Nutrisi", "description": "Sayuran hijau, sayuran akar, dan sayuran sehat lainnya."},
    {"name": "Karbohidrat", "section": "Bahan & Nutrisi", "description": "Sumber energi utama seperti nasi, roti, dan biji-bijian."},
    {"name": "Masakan Indonesia", "section": "Jenis Hidangan", "description": "Hidangan khas Indonesia yang populer dan bergizi."},
    {"name": "Jajanan Pasar", "section": "Jenis Hidangan", "description": "Camilan lokal tradisional yang digemari masyarakat."},
    {"name": "Fast Food", "section": "Jenis Hidangan", "description": "Menu siap saji dengan rasa cepat saji dan nyaman."},
    {"name": "Menu Sehat", "section": "Lainnya", "description": "Pilihan menu seimbang dan rendah kalori untuk hidup sehat."},
    {"name": "Makanan Instan", "section": "Lainnya", "description": "Produk makanan instan yang sering dikonsumsi sehari-hari."},
    {"name": "Menu Kafe", "section": "Lainnya", "description": "Pilihan makanan kafe modern dan minuman pelengkap."},
]


def seed_categories():
    session = SessionLocal()
    try:
        for category_data in CATEGORIES:
            existing = session.query(Category).filter(Category.name == category_data["name"]).first()
            if existing:
                existing.section = category_data["section"]
                existing.description = category_data["description"]
                continue

            category = Category(
                name=category_data["name"],
                section=category_data["section"],
                description=category_data["description"],
                item_count=0,
            )
            session.add(category)
        session.commit()
        print(f"Seeded {len(CATEGORIES)} categories.")
    except Exception as exc:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    seed_categories()
