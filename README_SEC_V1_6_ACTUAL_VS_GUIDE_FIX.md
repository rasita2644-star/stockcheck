# SEC V1.6 - Actual vs Company Guidance guardrail fix

This version fixes the Actual vs Guide % logic.

## What changed

1. Actual vs Guide % is calculated only when the guidance fiscal quarter has already been reported.
   - Example: latest actual Q3 2025 and guidance Q4 2025 => no comparison yet.

2. The comparison now uses an exact matching fiscal quarter from SEC revenue history.
   - Example: guidance Q4 2025 is compared with actual Q4 2025 only if that exact quarter exists.

3. Derived Q4 revenue is no longer used for Actual vs Guide %.
   - SEC companyfacts sometimes requires deriving Q4 as FY minus Q1-Q3.
   - This is useful for rough trend analysis but too risky for guidance beat/miss.

4. Non-positive or implausible values are blocked.
   - Revenue cannot be negative.
   - If parsed guidance is likely segment revenue / cloud revenue / ARR / bookings instead of total revenue, Actual vs Guide % is shown as N/A.

## Why

The previous V1.5 logic could compare a future guidance period against a derived or mismatched actual quarter, producing misleading values like -117%, -162%, or +250%.

V1.6 prefers N/A over a false precision number.
