# Desktop release
Tauri 2 packages the same R7.1 web client and talks only to the configured HTTPS API. The shell exposes no arbitrary shell command API. Window minimum is 1024×700.

## Windows
CI on windows-2025 builds the optimized x64 executable and requires real MSI and NSIS outputs before the job can pass. Run 35283028831 demonstrated both `Buenos días sol_0.7.1_x64_en-US.msi` and `Buenos días sol_0.7.1_x64-setup.exe`. Trusted Authenticode signing is intentionally not claimed; add the organization's private code-signing certificate only through CI secrets.

## macOS
CI on macos-15 builds Apple Silicon/aarch64 and requires both `.app` and DMG outputs. Run 35283028831 demonstrated `Buenos días sol.app` and `Buenos días sol_0.7.1_aarch64.dmg`. Intel support can be built on an x86_64 runner/target; a universal app can be assembled after both architecture artifacts are available. Apple distribution signing and notarization require an external Apple Developer Team, certificate/profile and notarization credentials and are not claimed.

## Updates
R7.1 uses semantic version 0.7.1 and a minimum-client/API compatibility policy. Desktop auto-update is not enabled until a signed update endpoint and signing keys exist; this avoids an unauthenticated update channel.
