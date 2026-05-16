# v7.1 Mobile fixed Port screeners

Mobile Safari had unreliable dynamic screener creation because old +New/long-press handlers were competing with the mobile tab renderer.

This version changes the mobile UX:

- Mobile screener tabs are fixed: Default, Momentum, Thai, Port 1, Port 2, Port 3, Settings.
- Port 1/2/3 are reserved screeners stored in localStorage.
- Rename changes the current Port label.
- Delete clears the current Port slot but does not remove the tab.
- Import/Replace/Append watchlist still works inside the active Port.
- Desktop behavior remains unchanged.

This avoids hidden/failed mobile dynamic tab creation and keeps backup portfolios always visible.
