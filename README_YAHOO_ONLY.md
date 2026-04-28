# v8.6 Yahoo-only

This version does not require FMP or Finnhub API keys.

Price target source priority:
1. Yahoo quoteSummary
2. Yahoo quote v7 fallback
3. N/A if Yahoo does not return target fields

Important limitation:
Yahoo's free/unofficial endpoints may not return targetLowPrice / targetMeanPrice / targetHighPrice for every ticker or every run. ETFs, small caps, ADRs, and non-US tickers often show N/A.

Fundamental actuals fallback:
For US-listed companies, the app also uses SEC companyfacts for actual quarterly Revenue / Net Income / EPS and QoQ / YoY comparisons.

Run:
python app.py

Open:
http://localhost:8787

Health check:
http://localhost:8787/api/health
