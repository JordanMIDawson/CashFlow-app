# 💲 Cash Flow — Personal Finance & Cash Flow Tracker

Cash Flow is a premium, state-of-the-art expense aggregator, cash flow tracker, and budget advisor. Drawing visual inspiration from the Money Flow app on iOS and modern fintech leaders, it features custom account grouping, granular period filtering, credit card rewards intelligence, and an ultra-sleek dark glassmorphic design.

---

## 🎨 App Icon & Aesthetics
- **Premium App Icon**: Designed in the luxury iOS squircle aesthetic, featuring a glowing emerald green and liquid electric cyan currency flow symbol on deep obsidian frosted glass (`icon.png`, `icon-512.png`, `icon-192.png`).
- **Full-Screen Responsive**: Automatically transforms into a borderless, native mobile experience when installed as an APK or PWA on mobile devices.

---

## 🚀 Key Features

1. **Transactions & Flow Ledger**:
   - Scrollable Net Cash Flow card that scrolls naturally out of the way for maximum vertical room.
   - Persistent quick period bar (`Period ›`, `2025`, `2026`, `Complete History`, `Custom Range`).
   - Grouped transaction streams organized by date, merchant, tags, categories with custom colors, pin-drop locations, and unobtrusive sync indicators.
   - Floating Action Button (`➕`) pinned in the bottom-right corner for rapid single-tap transaction entry.

2. **Dedicated Transaction Creation & Editing**:
   - Clean dedicated form for creating, duplicating, or deleting transactions with confirmation action bars.

3. **Multi-Account Grouping & Aggregates**:
   - Money Flow style account hierarchy: All Accounts aggregate total, followed by each individual account group (`Checking`, `Savings`, `Credit Cards`, `Demo & Test`).
   - Accounts can belong to multiple groups and display accurately under each.

4. **Clean Build vs Demo / Test Data**:
   - **Clean Slate Ready**: Ready for real personal accounts with $0 balance and 0 sample transactions.
   - **Demo & Test Sandbox**: Sample transactions and accounts are neatly isolated in the `Demo & Test` group.
   - **1-Click Clean Slate**: Tap `🧹 Clear Demo Data (Clean Slate)` in the Accounts tab to instantly purge all sample records, leaving you with a pristine environment for your own real data.
   - **1-Click Restore**: Tap `🧪 Load Demo Data` to bring back the mock dataset anytime for testing.

---

## 📲 Flashing & Installing on Android Device

### Method 1: Direct APK Flash via ADB (Recommended)
Connect your Android phone via USB with USB Debugging enabled in Developer Options, then run:
```bash
./flash_to_device.sh
```
This utility automatically flashes `CashFlow.apk` directly to your phone via `adb install -r CashFlow.apk` and launches the app!

### Method 2: Rebuilding the APK
To recompile the APK from the latest web assets:
```bash
python3 build_apk.py
```
This creates a fresh, signed `CashFlow.apk` (with your custom icons, CSS, and JS).

### Method 3: Browser PWA Live Mode
```bash
./launch_on_device.sh
```
Opens Cash Flow in Chrome on your phone via reverse port forwarding. Tap `⋮` -> **"Install app"** or **"Add to Home Screen"** to install the WebAPK natively.

---

## 📂 Project Layout

```bash
waterfall-cashflow-app/
├── CashFlow.apk                 # Ready-to-flash signed Android APK
├── build_apk.py                 # Self-contained APK compiler and signer
├── flash_to_device.sh           # 1-click ADB flash and install script
├── launch_on_device.sh          # Live device testing script with port forward
├── icon.png                     # Master high-res iOS-style app icon
├── icon-512.png                 # 512x512 Android & PWA splash icon
├── icon-192.png                 # 192x192 Android home screen icon
├── index.html                   # HTML structure & native mobile shell
├── style.css                    # Glassmorphic stylesheet & responsive rules
├── app.js                       # State engine, clean data manager & UI
└── manifest.json                # PWA & WebAPK specification
```
