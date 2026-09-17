# R7.1 Review — Multiplatform App, Deployment & Distribution Foundation

Status: **candidate validation in progress** on `r7.1-issue-11`. R8 is not started. SolarERP is not used.

## Evidence baseline
Run 35283028831 on SHA `c02aefaf379f7a38076bd1927634a4c6c7fdd2c0` completed **success** across regression, Android, unsigned iOS simulator compile, Windows Tauri and macOS Tauri. It demonstrated 167/167 full tests, clean PostgreSQL migration/seed/DB validation, frontend/backend typecheck + production build, Android APK/AAB build, Windows x64 MSI + NSIS installer, and Apple-Silicon macOS `.app` + `.dmg`. Artifact digests are recorded below. Subsequent R7.1-only commits add PWA/service-worker hardening, responsive evidence capture and stronger artifact assertions; the final candidate run must supersede this baseline before formal review.

Baseline artifacts (run 35283028831):
- web-dist — sha256 `3a0f4ffb1e2c0962665d8beef2a09fb28a1047b341d091c992df37fb840e1a3a`
- android-builds — sha256 `c5201e2f7096bba8558829130eb5cad3d8a6692df67f385363a0e3a23a24bbdc`
- desktop-windows-2025 — sha256 `03d476564ea7d064b856dbd1d87602532035ce73db6e2d75ba0353a96d6973ed`
- desktop-macos-15 — sha256 `e48423f0b8cf5e967b780c6e0fd65afc60d372b6b2a8c66425511dd62fcb7235`

## Acceptance audit — Issue #11
1. ✅ R0.1–R7 regressions — run 35283028831 regression: 167/167 tests.
2. ✅ Shared architecture/no duplicate engines — `docs/multiplatform-architecture.md`, distribution wrappers reuse accepted React/domain/API.
3. ✅ Web production build — run 35283028831 regression + web-dist artifact.
4. ⚠️ HTTPS deployment reproducible/documented in `docs/deployment.md`; actual permanent hosting/domain is external and not claimed.
5. ✅ Production API deployment path — `docs/deployment.md`, health/migration/env contract.
6. ✅ PostgreSQL migration path — run 35283028831 clean migrate/seed/db:validate.
7. 🟡 PWA manifest/install/service-worker metadata implemented; final candidate build validation pending.
8. 🟡 Responsive phone UX implemented in `src/styles.css`; final screenshot evidence pending.
9. 🟡 Responsive tablet UX implemented; final screenshot evidence pending.
10. ✅ Desktop UX preserved — baseline web/Tauri builds; final regression rerun pending after evidence-only hardening.
11. ✅ Android project/build — run 35283028831 Android job.
12. ✅ Android debug APK produced — run 35283028831 `android-builds`.
13. ✅ Android release AAB build path — `bundleRelease` succeeded in run 35283028831; store signing/publication not claimed.
14. 🟡 Android branding configured via Capacitor + generated official-logo derivatives; final candidate artifact validation pending.
15. 🟡 Android permissions baseline minimal by generated Capacitor project; final config evidence pending.
16. ✅ iOS project compiles — run 35283028831 iOS xcodebuild against iphonesimulator succeeded without signing.
17. 🟡 iPhone adaptive layout implemented; final viewport/simulator evidence pending.
18. 🟡 iPad adaptive layout implemented; final viewport/simulator evidence pending.
19. 🟡 iOS branding/config via `capacitor.config.ts`; final candidate artifact evidence pending.
20. ⚠️ Apple signing/TestFlight/App Store requires external Apple Developer credentials; no publication/signing claim.
21. ✅ Windows desktop builds — run 35283028831 Windows Tauri release.
22. ✅ Real Windows installers — run 35283028831 produced `Buenos días sol_0.7.1_x64_en-US.msi` and `Buenos días sol_0.7.1_x64-setup.exe`.
23. 🟡 Windows branding/window behavior configured in `src-tauri/tauri.conf.json`; final evidence pending.
24. ⚠️ Trusted Windows signing requires external private code-signing certificate; unsigned build is truthful.
25. ✅ macOS project builds — run 35283028831 macOS Tauri release.
26. ✅ Apple Silicon artifact — run 35283028831 produced aarch64 app/DMG.
27. ✅ macOS distributable — `Buenos días sol_0.7.1_aarch64.dmg` in baseline artifact.
28. ✅ Intel/universal strategy — `docs/desktop-release.md`.
29. ⚠️ Apple distribution signing/notarization requires external Apple Developer credentials; unsigned artifact only.
30. 🟡 Native auth/session uses the R7 backend cookie/session flow; final packaged-runtime evidence pending.
31. ✅ Tenant isolation server enforcement — full R7 regression/DB validation run 35283028831.
32. ✅ RBAC server enforcement — full R7 regression/DB validation run 35283028831.
33. ✅ R4 economics confidentiality — full R7 regression run 35283028831.
34. 🟡 es-MX default/en-US shared packaged UI implemented; final responsive evidence pending.
35. ✅ Organization-driven branding preserved; exact R7 source logo remains authoritative.
36. 🟡 Explicit offline/network/error UI implemented by `NetworkStatus`; final browser evidence pending.
37. ✅ R7 optimistic concurrency preserved — DB validation run 35283028831.
38. 🟡 Navigation/deep-link allowlist tests pass; secure persistent native bearer storage is intentionally absent because R7 uses server cookie session. Final security gate pending.
39. ✅ Camera/file/PDF/share platform adapter contract exists under `src/platform`.
40. 🟡 No client secrets by architecture/env policy; final bundle/security scan pending.
41. ✅ Unified version/compatibility strategy — package/Tauri 0.7.1, `CLIENT_MIN_VERSION`, `API_COMPATIBILITY`, compatibility tests.
42. 🟡 Multiplatform CI/artifact collection baseline succeeds; final same-SHA run pending.
43. 🟡 Required viewport evidence capture is implemented in `scripts/capture-r7-1.mjs`; native build evidence exists, final candidate collection pending.
44. 🟡 Required architecture/release/deployment/security docs exist; this review awaits final candidate evidence manifest.
45. ⏳ Formal stop only after final candidate gate. R8 has not started.

## External-account boundary
Permanent HTTPS hosting/domain/DNS, App Store/TestFlight distribution credentials, Google Play publication/signing credentials, trusted Windows code-signing certificate, and Apple distribution signing/notarization are external account actions. They are deliberately separated from unsigned/development technical readiness and are not represented as completed.
