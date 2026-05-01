# SEC V1.7 — Guidance History Matching

V1.7 changes the company guidance logic from "latest guidance only" to a small guidance history model.

## Why this exists

A company's latest earnings release usually reports the current quarter and gives guidance for the next quarter.
Example:

- Latest actual: Q3 2025
- New guide in the same release: Q4 2025

Q3 actual must not be compared to Q4 guide.
To calculate actual vs guide correctly, the system must find the earlier guidance that was issued for Q3 2025, usually from the Q2 earnings release.

## New fields

- `priorCompanyGuidanceRevenuePeriod`
- `priorCompanyGuidanceRevenue`
- `actualVsPriorGuidanceRevenuePct`
- `nextCompanyGuidanceRevenue`
- `nextCompanyGuidanceRevenuePeriod`
- `guidanceHistory`

## Table changes

The Fundamental table now separates:

- Prior Guide Period
- Prior Co. Guide Mid
- Actual vs Prior Guide %
- Next Co. Guide Mid
- Next Guide Period

## Guardrails

The parser only calculates Actual vs Prior Guide when:

1. The prior guide period matches the latest actual quarter.
2. The guidance was filed before the latest actual period ended.
3. The actual revenue exists for that same quarter.
4. The actual/guide magnitude looks comparable.
5. SEC-derived Q4 actuals are not used for comparison.

If these checks fail, it returns N/A rather than a misleading number.
