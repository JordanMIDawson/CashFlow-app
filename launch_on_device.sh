#!/bin/bash

# Clear terminal
clear
echo "====================================================="
echo "💲 Cash Flow — Device Launch Utility"
echo "====================================================="

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
  echo "Once allowed, re-run this script to launch the app!"
  exit 1
fi

if [ -z "$device_check" ]; then
  echo "🚨 NO ACTIVE DEVICE CONNECTED VIA USB/ADB!"
  echo "Make sure your phone is connected via a USB cable and Developer Options are enabled."
  exit 1
fi

# Extract device ID
device_id=$(echo "$device_check" | awk '{print $1}')
echo "✅ Active Android Device Detected: $device_id"
echo "🚀 Launching browser intent on the device..."

# Reverse port forward 8080 so phone can access localhost:8080
adb -s "$device_id" reverse tcp:8080 tcp:8080 2>/dev/null

# Launch URL intent on the device
adb -s "$device_id" shell am start -a android.intent.action.VIEW -d "http://localhost:8080" 2>/dev/null || \
adb -s "$device_id" shell am start -a android.intent.action.VIEW -d "http://192.0.0.2:8080"

echo "-----------------------------------------------------"
echo "✅ Opened Cash Flow on your connected phone!"
echo "To install as a native standalone app: Tap ⋮ -> 'Install app' or 'Add to Home Screen'."
echo "To flash the offline APK directly: run ./flash_to_device.sh"
echo "====================================================="
