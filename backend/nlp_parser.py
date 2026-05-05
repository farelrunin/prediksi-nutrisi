import re
from typing import Dict, List, Optional, Tuple

import json
from database import SessionLocal
from models import Food

FOOD_NUTRITION_DB = {}
FOOD_CATALOG = []
_is_initialized = False

def initialize_food_data():
    global FOOD_NUTRITION_DB, FOOD_CATALOG, _is_initialized
    if _is_initialized:
        return

    db = SessionLocal()
    try:
        foods = db.query(Food).all()
        catalog = []
        nutrition_db = {}
        
        for food in foods:
            normalized_name = food.food_name_en.lower()
            name_id = food.food_name_id if food.food_name_id else food.food_name_en
            
            aliases = [normalized_name]
            if name_id and name_id.lower() not in aliases:
                aliases.append(name_id.lower())
            
            if food.alternate_names:
                try:
                    alts = json.loads(food.alternate_names)
                    for alt in alts:
                        if isinstance(alt, str) and alt.lower() not in aliases:
                            aliases.append(alt.lower())
                except Exception:
                    alts = [a.strip().lower() for a in str(food.alternate_names).split(',')]
                    for alt in alts:
                        if alt and alt not in aliases:
                            aliases.append(alt)
            
            # Sort aliases by length descending so longer phrases match first
            aliases.sort(key=len, reverse=True)
            
            catalog.append({
                "name": name_id,
                "normalized_name": normalized_name,
                "aliases": aliases,
                "default_unit": food.serving_unit if food.serving_unit else "porsi"
            })
            
            nutrition_db[normalized_name] = {
                "calories": food.calories or 0.0,
                "protein": food.protein or 0.0,
                "carbs": food.carbohydrates or 0.0,
                "fat": food.total_fat or 0.0,
                "unit": "per 100g"
            }
            
        # Post-processing to clean up overly generic aliases
        for entry in catalog:
            if entry["name"].lower() == "nasi padang":
                if "nasi" in entry["aliases"]:
                    entry["aliases"].remove("nasi")
            if entry["name"].lower() == "susu":
                if "susu" in entry["aliases"]:
                    pass # it's fine for 'susu' to have 'susu' as alias
        
        # Inject custom dummy catalog entries for missing Indonesian items
        custom_foods = [
            {
                "name": "Nasi Jagung",
                "normalized_name": "corn rice",
                "aliases": ["nasi jagung", "sego jagung", "corn rice"],
                "default_unit": "porsi"
            },
            {
                "name": "Susu Coklat",
                "normalized_name": "chocolate milk",
                "aliases": ["susu coklat", "susu cokelat", "chocolate milk", "choc milk"],
                "default_unit": "gelas"
            },
            {
                "name": "Energen",
                "normalized_name": "energen cereal",
                "aliases": ["energen", "sereal energen"],
                "default_unit": "bungkus"
            }
        ]
        
        for cf in custom_foods:
            catalog.append(cf)
            nutrition_db[cf["normalized_name"]] = {
                "calories": 150.0 if "nasi" in cf["name"].lower() else 130.0,
                "protein": 3.0 if "nasi" in cf["name"].lower() else 4.0,
                "carbs": 30.0 if "nasi" in cf["name"].lower() else 25.0,
                "fat": 1.0 if "nasi" in cf["name"].lower() else 2.5,
                "unit": "per porsi/bungkus"
            }
            
        FOOD_CATALOG = catalog
        FOOD_NUTRITION_DB = nutrition_db
        _is_initialized = True
        print(f"Loaded {len(FOOD_CATALOG)} foods into NLP parser.")
    except Exception as e:
        print(f"Failed to initialize food data: {e}")
    finally:
        db.close()

SIZE_MULTIPLIERS = {
    "kecil": 0.7,
    "mini": 0.7,
    "sedang": 1.0,
    "normal": 1.0,
    "besar": 1.3,
    "jumbo": 1.6,
}

AMBIGUOUS_QUANTITIES = {
    "lumayan banyak": 1.5,
    "setengah": 0.5,
    "separuh": 0.5,
    "separo": 0.5,
    "sedikit": 0.5,
    "dikit": 0.5,
    "banyak": 2.0,
}

UNIT_PHRASES = {
    "seporsi": (1.0, "porsi"),
    "sepiring": (1.0, "piring"),
    "segelas": (1.0, "gelas"),
    "semangkuk": (1.0, "mangkok"),
    "semangkok": (1.0, "mangkok"),
    "sebuah": (1.0, "buah"),
    "sepotong": (1.0, "potong"),
    "selembar": (1.0, "lembar"),
    "sebungkus": (1.0, "bungkus"),
    "sebutir": (1.0, "butir"),
}

NUMBER_WORDS = {
    "nol": 0.0,
    "satu": 1.0,
    "dua": 2.0,
    "tiga": 3.0,
    "empat": 4.0,
    "lima": 5.0,
    "enam": 6.0,
    "tujuh": 7.0,
    "delapan": 8.0,
    "sembilan": 9.0,
    "sepuluh": 10.0,
}

UNIT_EQUIVALENTS = {
    "gram": 1.0,
    "gr": 1.0,
    "kg": 1000.0,
    "ml": 1.0,
    "porsi": 100.0,
    "piring": 150.0,
    "mangkok": 200.0,
    "mangkur": 200.0,
    "gelas": 250.0,
    "buah": 100.0,
    "potong": 50.0,
    "lembar": 30.0,
    "bungkus": 85.0,
    "butir": 55.0,
}

DELIMITER_PATTERN = re.compile(
    r"\s*(?:,|\.|;|:|\(|\)|\bdan\b|\bterus\b|\blalu\b|\bkemudian\b|\bserta\b|\bsama\b|\bdengan\b)\s*"
)
UNIT_PATTERN = r"(gram|gr|kg|ml|porsi|piring|mangkok|mangkur|gelas|buah|potong|lembar|bungkus|butir)"


def parse_food_story(story: str) -> Dict:
    initialize_food_data()
    original_story = story.strip()
    normalized_story = normalize_text(story)

    foods = extract_foods_from_text(normalized_story)
    if not foods:
        foods = fallback_extract_foods(normalized_story)

    total_nutrition = calculate_total_nutrition(foods)

    return {
        "parsed_foods": foods,
        "total_nutrition": total_nutrition,
        "original_story": original_story,
    }


def normalize_text(text: str) -> str:
    normalized = text.lower().strip()
    normalized = re.sub(r"(?<=\d),(?=\d)", ".", normalized)
    normalized = normalized.replace("/", " dan ")
    normalized = re.sub(r"[!?]", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized


def extract_foods_from_text(text: str) -> List[Dict]:
    foods: List[Dict] = []

    for segment in split_segments(text):
        foods.extend(parse_segment(segment))

    return foods


def split_segments(text: str) -> List[str]:
    return [segment.strip() for segment in DELIMITER_PATTERN.split(text) if segment.strip()]


def parse_segment(segment: str) -> List[Dict]:
    matches = find_food_matches(segment)
    if not matches:
        return []

    parsed_items: List[Dict] = []
    for index, match in enumerate(matches):
        prev_end = matches[index - 1]["end"] if index > 0 else 0
        next_start = matches[index + 1]["start"] if index + 1 < len(matches) else len(segment)
        context_start = max(0, prev_end)
        context_end = min(len(segment), next_start)
        context = segment[context_start:context_end].strip()

        quantity, unit = extract_quantity_and_unit(
            context=context,
            alias=match["alias"],
            default_unit=match["default_unit"],
        )

        nutrition_key = match["normalized_name"]
        if nutrition_key not in FOOD_NUTRITION_DB:
            continue

        estimated_grams = estimate_quantity_grams(quantity, unit)
        parsed_items.append({
            "name": match["name"],
            "normalized_name": nutrition_key,
            "quantity": round(quantity, 2),
            "unit": unit,
            "portion": format_portion(quantity, unit),
            "estimated_grams": round(estimated_grams, 1),
            "nutrition": FOOD_NUTRITION_DB[nutrition_key],
        })

    return parsed_items


def find_food_matches(segment: str) -> List[Dict]:
    candidates = []

    for entry in FOOD_CATALOG:
        for alias in entry["aliases"]:
            pattern = rf"(?<!\w){re.escape(alias)}(?!\w)"
            for found in re.finditer(pattern, segment):
                candidates.append({
                    "start": found.start(),
                    "end": found.end(),
                    "alias": alias,
                    "name": entry["name"],
                    "normalized_name": entry["normalized_name"],
                    "default_unit": entry["default_unit"],
                })

    candidates.sort(key=lambda item: (item["start"], -(item["end"] - item["start"])))

    selected = []
    occupied: List[Tuple[int, int]] = []
    for candidate in candidates:
        if any(not (candidate["end"] <= start or candidate["start"] >= end) for start, end in occupied):
            continue
        selected.append(candidate)
        occupied.append((candidate["start"], candidate["end"]))

    selected.sort(key=lambda item: item["start"])
    return selected


def extract_quantity_and_unit(context: str, alias: str, default_unit: str) -> Tuple[float, str]:
    quantity = 1.0
    unit = default_unit

    escaped_alias = re.escape(alias)

    after_number = re.search(
        rf"{escaped_alias}\s+(?P<qty>\d+(?:\.\d+)?)\s*(?P<unit>{UNIT_PATTERN})?",
        context,
    )
    before_number = re.search(
        rf"(?P<qty>\d+(?:\.\d+)?)\s*(?P<unit>{UNIT_PATTERN})?\s+{escaped_alias}",
        context,
    )

    match = after_number or before_number
    if match:
        quantity = float(match.group("qty"))
        unit = match.group("unit") or unit
    else:
        unit_quantity = extract_unit_phrase(context)
        if unit_quantity:
            quantity, unit = unit_quantity
        else:
            word_quantity = extract_number_word(context)
            if word_quantity is not None:
                quantity = word_quantity
            else:
                ambiguous_quantity = extract_ambiguous_quantity(context)
                if ambiguous_quantity is not None:
                    quantity = ambiguous_quantity

    size_multiplier = extract_size_multiplier(context)
    quantity *= size_multiplier

    return quantity, unit


def extract_unit_phrase(text: str) -> Optional[Tuple[float, str]]:
    for phrase, value in UNIT_PHRASES.items():
        if re.search(rf"(?<!\w){re.escape(phrase)}(?!\w)", text):
            return value
    return None


def extract_number_word(text: str) -> Optional[float]:
    for word, value in NUMBER_WORDS.items():
        if re.search(rf"(?<!\w){re.escape(word)}(?!\w)", text):
            return value
    return None


def extract_ambiguous_quantity(text: str) -> Optional[float]:
    for phrase, value in sorted(AMBIGUOUS_QUANTITIES.items(), key=lambda item: len(item[0]), reverse=True):
        if re.search(rf"(?<!\w){re.escape(phrase)}(?!\w)", text):
            return value
    return None


def extract_size_multiplier(text: str) -> float:
    for word, multiplier in SIZE_MULTIPLIERS.items():
        if re.search(rf"(?<!\w){re.escape(word)}(?!\w)", text):
            return multiplier
    return 1.0


def fallback_extract_foods(text: str) -> List[Dict]:
    foods: List[Dict] = []
    seen = set()

    for entry in FOOD_CATALOG:
        if any(alias in text for alias in entry["aliases"]) and entry["name"] not in seen:
            quantity = 1.0
            unit = entry["default_unit"]
            nutrition_key = entry["normalized_name"]
            foods.append({
                "name": entry["name"],
                "normalized_name": nutrition_key,
                "quantity": quantity,
                "unit": unit,
                "portion": format_portion(quantity, unit),
                "estimated_grams": round(estimate_quantity_grams(quantity, unit), 1),
                "nutrition": FOOD_NUTRITION_DB[nutrition_key],
            })
            seen.add(entry["name"])

    return foods


def calculate_total_nutrition(foods: List[Dict]) -> Dict:
    total = {
        "calories": 0.0,
        "protein": 0.0,
        "carbs": 0.0,
        "fat": 0.0,
        "quantity_grams": 0.0,
    }

    for food in foods:
        grams = food.get("estimated_grams", estimate_quantity_grams(food.get("quantity", 1.0), food.get("unit", "porsi")))
        multiplier = grams / 100.0
        nutrition = food["nutrition"]

        total["calories"] += nutrition["calories"] * multiplier
        total["protein"] += nutrition["protein"] * multiplier
        total["carbs"] += nutrition["carbs"] * multiplier
        total["fat"] += nutrition["fat"] * multiplier
        total["quantity_grams"] += grams

    for key in total:
        total[key] = round(total[key], 1)

    return total


def estimate_quantity_grams(quantity: float, unit: str) -> float:
    grams_per_unit = UNIT_EQUIVALENTS.get(unit, 100.0)
    return max(quantity, 0.0) * grams_per_unit


def format_portion(quantity: float, unit: str) -> str:
    formatted_quantity = int(quantity) if float(quantity).is_integer() else round(quantity, 2)
    return f"{formatted_quantity} {unit}"


if __name__ == "__main__":
    test_story = (
        "Hari ini agak kacau sih makannya, pagi cuma sempat minum kopi sedikit sama roti setengah, "
        "siangnya makan nasi padang lumayan banyak (ayam 1, rendang dikit, sayur nangka), "
        "terus sore ngemil 2 gorengan sama es teh, malamnya cuma buah pisang 1 sama susu sedikit"
    )
    print(parse_food_story(test_story))
