"""
Sri Lankan Agricultural Market Simulator

Generates 3 years of weekly wholesale crop prices modeled after
real-world Sri Lankan seasonality (Maha/Yala cycles), inflation
trends, and supply-shock events.
"""

import os
import numpy as np
import pandas as pd

np.random.seed(42)

WEEKS = 156  # 3 years of weekly data
START_DATE = pd.Timestamp("2022-01-03")  # a Monday

# Each crop has a base price (LKR/kg), a seasonal amplitude,
# a phase shift (which week of the year the price peaks),
# and a noise factor controlling random volatility.
CROPS = {
    "ONION_BIG_LK": {
        "name": "Big Onion",
        "base_price": 220,
        "seasonal_amplitude": 120,
        # peaks around week 25 (June-July) when local stocks deplete
        "peak_week": 25,
        "noise_std": 18,
        "trend_per_week": 0.35,
    },
    "TOMATO_LK": {
        "name": "Tomato",
        "base_price": 160,
        "seasonal_amplitude": 90,
        # peaks around week 10 (March) during dry spell
        "peak_week": 10,
        "noise_std": 22,
        "trend_per_week": 0.28,
    },
    "CARROT_LK": {
        "name": "Carrot",
        "base_price": 280,
        "seasonal_amplitude": 70,
        "peak_week": 30,
        "noise_std": 15,
        "trend_per_week": 0.30,
    },
    "POTATO_LK": {
        "name": "Potato",
        "base_price": 200,
        "seasonal_amplitude": 60,
        "peak_week": 28,
        "noise_std": 14,
        "trend_per_week": 0.25,
    },
    "LEEKS_LK": {
        "name": "Leeks",
        "base_price": 320,
        "seasonal_amplitude": 80,
        "peak_week": 8,
        "noise_std": 16,
        "trend_per_week": 0.32,
    },
    "CAPSICUM_LK": {
        "name": "Capsicum",
        "base_price": 260,
        "seasonal_amplitude": 95,
        "peak_week": 12,
        "noise_std": 20,
        "trend_per_week": 0.27,
    },
}


def generate_crop_series(crop_id: str, config: dict) -> pd.DataFrame:
    dates = pd.date_range(start=START_DATE, periods=WEEKS, freq="W-MON")

    weeks_in_year = np.arange(WEEKS) % 52

    # seasonal component: sinusoidal peaking at peak_week
    phase = 2 * np.pi * (weeks_in_year - config["peak_week"]) / 52
    seasonal = config["seasonal_amplitude"] * np.sin(phase)

    # inflation trend
    trend = config["trend_per_week"] * np.arange(WEEKS)

    # random walk noise (autoregressive so prices look natural)
    noise = np.zeros(WEEKS)
    for i in range(1, WEEKS):
        noise[i] = 0.6 * noise[i - 1] + np.random.normal(0, config["noise_std"])

    # supply shock events: 2-3 random spikes over 3 years
    shocks = np.zeros(WEEKS)
    n_shocks = np.random.randint(2, 4)
    for _ in range(n_shocks):
        shock_week = np.random.randint(10, WEEKS - 10)
        shock_magnitude = np.random.uniform(0.3, 0.7) * config["base_price"]
        # shock decays over ~6 weeks
        for w in range(8):
            idx = shock_week + w
            if idx < WEEKS:
                shocks[idx] += shock_magnitude * np.exp(-0.5 * w)

    prices = config["base_price"] + seasonal + trend + noise + shocks
    prices = np.maximum(prices, config["base_price"] * 0.3)  # floor
    prices = np.round(prices, 2)

    return pd.DataFrame({
        "date": dates,
        "crop_id": crop_id,
        "crop_name": config["name"],
        "price_lkr": prices,
    })


def main():
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(data_dir, exist_ok=True)

    all_frames = []
    for crop_id, config in CROPS.items():
        df = generate_crop_series(crop_id, config)
        filepath = os.path.join(data_dir, f"{crop_id}.csv")
        df.to_csv(filepath, index=False)
        all_frames.append(df)
        print(f"  {crop_id}: {len(df)} weeks -> {filepath}")

    combined = pd.concat(all_frames, ignore_index=True)
    combined.to_csv(os.path.join(data_dir, "all_crops.csv"), index=False)
    print(f"\nCombined dataset: {len(combined)} rows -> data/all_crops.csv")


if __name__ == "__main__":
    main()
