#!/bin/bash
clear
echo "====================================================="
echo "💲 Cash Flow — Android Device Flash & Install Utility"
echo "====================================================="

# Check for ADB
if ! command -v adb &> /dev/null; then
  echo "🚨 'adb' command not found. Please ensure Android Platform Tools are in PATH."
  exit 1
fi

# Check for connected ADB devices
device_check=$(adb devices | grep -v "List of devices" | grep "device")
unauth_check=$(adb devices | grep "unauthorized")

if [ -n "$unauth_check" ]; then
  echo "🚨 DEVICE UNAUTHORIZED DETECTED!"
  echo "-----------------------------------------------------"
  echo "Please look at your connected phone's screen."
  echo "A popup asking 'Allow USB debugging?' should be visible."
  echo "1. Check the box 'Always allow from this computer'."
  echo "2. Tap 'Allow' or 'OK'."
  echo "-----------------------------------------------------"
  echo "Once allowed, re-run this script to flash the app!"
  exit 1
fi

if [ -z "$device_check" ]; then
  echo "🚨 NO ACTIVE DEVICE CONNECTED VIA USB/ADB!"
  echo "Connect your Android device via USB with USB Debugging enabled in Developer Options."
  exit 1
fi

device_id=$(echo "$device_check" | awk '{print $1}')
echo "✅ Active Android Device Detected: $device_id"

# Check if CashFlow.apk exists; if not, build it
if [ ! -f "CashFlow.apk" ]; then
  echo "📦 Compiling CashFlow.apk..."
  python3 build_apk.py
fi

echo "🧹 Purging previous build cache from launcher..."
adb -s "$device_id" uninstall com.example.famexpensync 2>/dev/null

echo "🚀 Flashing updated CashFlow.apk to device ($device_id)..."
adb -s "$device_id" install -t CashFlow.apk

if [ $? -eq 0 ]; then
  echo "✅ Installation Successful!"
  echo "📲 Launching Cash Flow on your Android phone..."
  adb -s "$device_id" shell am start -n com.example.famexpensync/.MainActivity
  echo "====================================================="
  echo "🎉 Cash Flow is now installed and running on your device!"
  echo "====================================================="
else
  echo "⚠️ Direct APK flash failed. Attempting PWA install mode..."
  adb -s "$device_id" reverse tcp:8080 tcp:8080
  adb -s "$device_id" shell am start -a android.intent.action.VIEW -d "http://localhost:8080"
  echo "Opened Cash Flow in Chrome. Tap 'Add to Home Screen' or 'Install App'."
fi
