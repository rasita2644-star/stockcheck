# Stock Timing Radar v6.7 — Mobile Memo Creation Flow

This build keeps the Technical / Fundamental scanner split and adds a complete mobile memo creation workflow.

## New mobile/tablet flow

- Floating `+` action button fixed at the bottom-right.
- Tapping `+` opens an action sheet with:
  - Add Memo
  - Add From Screener
  - Import Current Stock
- Add Memo opens the full creation form.
- Add From Screener opens a searchable picker using the current screener results.
- Import Current Stock prefills the memo form from the currently selected stock.

## Prefilled fields from screener

When importing from screener, the form prefills / displays:

- ticker
- current price
- current trend
- EMA status
- nearest EMA distance

The user then fills:

- memo reason
- target price
- target direction
- conviction
- action plan
- source link
- category

## Desktop

- The Memo page header keeps `+ Add Memo`.
- Added desktop buttons:
  - Add From Screener
  - Import Current Stock

## Mobile usability

- Large tap targets.
- Bottom sheet / full-screen modal behavior.
- Sticky Save / Cancel actions at the bottom of the memo form.
- No horizontal scrolling in the creation form.
