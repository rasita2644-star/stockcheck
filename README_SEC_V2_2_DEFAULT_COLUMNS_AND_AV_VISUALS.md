# SEC V2.2 — Default Fundamental Columns + Alpha Vantage Visual Direction

Changes:

- Fundamental tab default columns now match the cleaner layout used during testing.
- Guidance-history columns are OFF by default:
  - Prior Guide Period
  - Prior Co. Guide Mid
  - Actual vs Prior Guide %
  - Next Co. Guide Mid
  - Next Guide Period
- Storage key bumped to `stockTimingRadar.activeSettings.v5.secV2_2_defaultCols` so existing browser settings do not keep the old default.
- Alpha Vantage analyst consensus remains manual/on-demand only and is not mixed into the SEC table.

Recommended next visual additions for V2.3:

1. Analyst rating distribution horizontal bar chart:
   Strong Buy / Buy / Hold / Sell / Strong Sell.

2. Price position dot/range view:
   52-week low -> current price -> analyst target -> 52-week high.

Alpha Vantage OVERVIEW gives a single analyst target price and rating split, but not a true high/low/median target range, so a full target-range scatter plot should wait for a provider with high/low/median target data.
