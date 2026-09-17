# Mobile release
Android and iOS/iPadOS use Capacitor with the same compiled web assets and R7 backend. `mx.enertika.buenosdiassol` is the application identifier and `Buenos días sol` the native product name. Platform icons are generated as non-distorted square derivatives from the exact authoritative R7 logo; the source asset is never overwritten.

## Android
CI adds/synchronizes the Capacitor Android project, builds `assembleDebug` and `bundleRelease`, and explicitly asserts `app-debug.apk` plus `app-release.aab` exist. Run 35283028831 demonstrated the APK/AAB build path. Store publication/signing uses an organization-owned Play keystore in CI secrets; Google Play publication is not claimed. No camera/location/background permission is added by R7.1 unless a future reviewed native capability actually requires it.

## iOS/iPadOS
CI adds/synchronizes the Capacitor iOS project and compiles the Debug iPhoneSimulator target with signing disabled; final CI also retains the resulting simulator `.app`. Adaptive shared layouts cover iPhone/iPad viewports and safe-area CSS. Device/TestFlight/App Store distribution requires an Apple Developer Team, certificates and provisioning profiles and is not claimed.

## Version/update policy
App version is 0.7.1 across package/Tauri with API compatibility 7.1 and minimum client 0.7.1. Mobile production updates are distributed through the platform stores once external accounts/signing exist; incompatible stale clients must be rejected by compatibility policy rather than silently writing data.
