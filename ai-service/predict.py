"""
Forecast generator.

Loads pre-trained SARIMA and GARCH models from ./models and produces
the exact JSON structure the React frontend expects.
"""

import os
import joblib
import numpy as np
from datetime import datetime

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

CROP_META = {
    "ONION_BIG_LK": {"name": "Big Onion", "origin": "Dambulla", "category": "Vegetables"},
    "TOMATO_LK": {"name": "Tomato", "origin": "Nuwara Eliya", "category": "Vegetables"},
    "CARROT_LK": {"name": "Carrot", "origin": "Nuwara Eliya", "category": "Root Crops"},
    "POTATO_LK": {"name": "Potato", "origin": "Badulla", "category": "Root Crops"},
    "LEEKS_LK": {"name": "Leeks", "origin": "Nuwara Eliya", "category": "Vegetables"},
    "CAPSICUM_LK": {"name": "Capsicum", "origin": "Dambulla", "category": "Vegetables"},
}

# cache loaded models in memory
_sarima_cache: dict = {}
_garch_cache: dict = {}


def _load_models(crop_id: str):
    if crop_id not in _sarima_cache:
        sarima_path = os.path.join(MODEL_DIR, f"{crop_id}_sarima.pkl")
        garch_path = os.path.join(MODEL_DIR, f"{crop_id}_garch.pkl")

        if not os.path.exists(sarima_path) or not os.path.exists(garch_path):
            return None, None

        _sarima_cache[crop_id] = joblib.load(sarima_path)
        _garch_cache[crop_id] = joblib.load(garch_path)

    return _sarima_cache[crop_id], _garch_cache[crop_id]


def _volatility_label(vol: float) -> str:
    if vol < 0.10:
        return "Low"
    if vol < 0.15:
        return "Moderate"
    if vol < 0.25:
        return "Moderate-High"
    return "High"


def _risk_score(vol: float) -> int:
    return min(100, max(0, int(vol * 350)))


def _build_recommendation(crop_name: str, forecast: list, vol: float) -> str:
    prices = [w["price"] for w in forecast]
    max_price_week = forecast[np.argmax(prices)]["week"]
    min_price_week = forecast[np.argmin(prices)]["week"]

    if vol > 0.20:
        return (
            f"{crop_name} prices show high volatility. "
            f"Consider locking in advance contracts around Week {min_price_week} "
            f"before the predicted spike near Week {max_price_week}."
        )
    if vol > 0.12:
        return (
            f"Moderate price swings expected for {crop_name}. "
            f"Best buying window is around Week {min_price_week}. "
            f"Prices are predicted to peak near Week {max_price_week}."
        )
    return (
        f"{crop_name} prices are relatively stable. "
        f"No urgent action required, but monitor around Week {max_price_week} for seasonal changes."
    )


def generate_forecast(crop_id: str) -> dict | None:
    sarima_result, garch_result = _load_models(crop_id)
    if sarima_result is None:
        return None

    meta = CROP_META.get(crop_id, {"name": crop_id, "origin": "Unknown", "category": "Unknown"})
    horizon = 52

    # SARIMA forecast with confidence intervals
    sarima_forecast = sarima_result.get_forecast(steps=horizon)
    predicted_prices = sarima_forecast.predicted_mean.values
    conf_int = sarima_forecast.conf_int(alpha=0.10)  # 90% CI
    lower_ci = conf_int.iloc[:, 0].values
    upper_ci = conf_int.iloc[:, 1].values

    # identify lean season weeks (top quartile of predicted prices)
    price_threshold = np.percentile(predicted_prices, 75)

    forecast_items = []
    for i in range(horizon):
        week_num = i + 1
        entry = {
            "week": week_num,
            "week_label": f"Wk {week_num}",
            "price": round(float(max(predicted_prices[i], 10)), 0),
            "lower_ci": round(float(max(lower_ci[i], 5)), 0),
            "upper_ci": round(float(max(upper_ci[i], 15)), 0),
        }
        if predicted_prices[i] >= price_threshold:
            entry["lean_season"] = True
        forecast_items.append(entry)

    # GARCH volatility metrics
    garch_forecast = garch_result.forecast(horizon=horizon)
    variance_forecast = garch_forecast.variance.values[-1]
    sigma_forecast = np.sqrt(variance_forecast) / 100  # back to decimal scale

    current_vol = float(sigma_forecast[0])

    # volatility history: sample every 4 weeks
    vol_history = []
    for i in range(0, horizon, 4):
        vol_history.append({
            "week": f"Wk {i + 1}",
            "sigma": round(float(sigma_forecast[i]), 3),
        })

    avg_vol = float(np.mean(sigma_forecast))
    confidence = round(max(0.5, min(0.99, 1.0 - avg_vol)), 2)

    return {
        "crop_id": crop_id,
        "crop_name": meta["name"],
        "model": f"SARIMA{sarima_result.specification['order']}"
                 f"x{sarima_result.specification['seasonal_order']}",
        "currency": "LKR",
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "forecast": forecast_items,
        "garch_metrics": {
            "model": "GARCH(1,1)",
            "current_volatility": round(current_vol, 3),
            "volatility_label": _volatility_label(current_vol),
            "risk_score": _risk_score(current_vol),
            "volatility_history": vol_history,
            "forecast_confidence": confidence,
            "recommendation": _build_recommendation(
                meta["name"], forecast_items, current_vol
            ),
        },
    }
