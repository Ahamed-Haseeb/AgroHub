"""
SARIMA + GARCH model trainer.

Reads per-crop CSVs from ./data, fits a SARIMA model for price
forecasting and a GARCH model for volatility estimation, then
saves the trained models to ./models as .pkl files.
"""

import os
import warnings
import joblib
import numpy as np
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX
from arch import arch_model

warnings.filterwarnings("ignore")

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")


def train_sarima(series: pd.Series, crop_id: str):
    """
    Fits SARIMA(1,1,1)(1,0,1)[52] on the weekly price series.
    The (1,0,1)[52] seasonal order captures the annual cycle.
    """
    model = SARIMAX(
        series,
        order=(1, 1, 1),
        seasonal_order=(1, 0, 1, 52),
        enforce_stationarity=False,
        enforce_invertibility=False,
    )
    result = model.fit(disp=False, maxiter=300)
    print(f"  SARIMA AIC: {result.aic:.1f}")
    return result


def train_garch(series: pd.Series, crop_id: str):
    """
    Fits GARCH(1,1) on the weekly log-returns of the price series
    to model conditional volatility.
    """
    log_returns = np.log(series / series.shift(1)).dropna() * 100

    model = arch_model(
        log_returns,
        vol="Garch",
        p=1,
        q=1,
        dist="normal",
        rescale=False,
    )
    result = model.fit(disp="off", show_warning=False)
    print(f"  GARCH log-likelihood: {result.loglikelihood:.1f}")
    return result


def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    crop_files = [f for f in os.listdir(DATA_DIR) if f.endswith(".csv") and f != "all_crops.csv"]

    for filename in sorted(crop_files):
        crop_id = filename.replace(".csv", "")
        filepath = os.path.join(DATA_DIR, filename)
        print(f"\nTraining {crop_id}...")

        df = pd.read_csv(filepath, parse_dates=["date"])
        df = df.sort_values("date").reset_index(drop=True)
        prices = df["price_lkr"]

        sarima_result = train_sarima(prices, crop_id)
        garch_result = train_garch(prices, crop_id)

        sarima_path = os.path.join(MODEL_DIR, f"{crop_id}_sarima.pkl")
        garch_path = os.path.join(MODEL_DIR, f"{crop_id}_garch.pkl")

        joblib.dump(sarima_result, sarima_path)
        joblib.dump(garch_result, garch_path)

        print(f"  Saved -> {sarima_path}")
        print(f"  Saved -> {garch_path}")

    print("\nAll models trained.")


if __name__ == "__main__":
    main()
