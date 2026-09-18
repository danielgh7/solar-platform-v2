# R7.1 Review — Multiplatform App, Deployment & Distribution Foundation

Status: **ready for formal audit** on `r7.1-issue-11`. R8 has not started. SolarERP is not used.

## Audited candidate

- Candidate SHA: `4fc306d5134ab370556bf3d36298ce3493e83ea8`
- Workflow run: [35356408860](https://github.com/danielgh7/solar-platform-v2/actions/runs/35356408860)
- Result: **success**
- Jobs: `regression`, `android`, `android-runtime (pixel_7)`, `android-runtime (pixel_tablet)`, `ios`, `desktop (windows-2025)`, `desktop (macos-15)`, and `manifest` all completed successfully.
- Final artifact manifest: `r7-1-final-manifest`, artifact ID `10552940271`, archive digest `sha256:e169e4be3673c148fdd3dd5ad3edc1d1e01fdf1efaae6e6b0013d9bd7d3712b2`.
- `artifact-manifest.json` identifies candidate `4fc306d5134ab370556bf3d36298ce3493e83ea8` and run `35356408860`.
- Manifest integrity: 94 files and 94 SHA-256 entries. The manifest gate downloaded all nine upstream artifacts, required each platform deliverable individually, and completed successfully.

Representative final artifacts:

| Artifact | Evidence | SHA-256 |
|---|---|---|
| Android APK | `android-builds/app/build/outputs/apk/debug/app-debug.apk` | `8e9e0a6d8cbc8becea786cbf879e2fb69260bea00a42ff8ea952a92c8e621e26` |
| Android AAB | `android-builds/app/build/outputs/bundle/release/app-release.aab` | `2d0f22b862380810adcddeeaf7e47279bf9c4ed854a67fc0bde192013b39482e` |
| Windows MSI | `Buenos días sol_0.7.1_x64_en-US.msi` | `fda4d9988b5fc4f385f722ae3271aeec3742c8bcd13b8babc8d34bbc3046f087` |
| Windows NSIS | `Buenos días sol_0.7.1_x64-setup.exe` | `953dda2bad7c75ef639664c32d02ad6de0e636dd94b467b3f6b8884d67f8c182` |
| macOS DMG | `Buenos días sol_0.7.1_aarch64.dmg` | `5f9976d075328e649be5006755e9ce1bd444de94f2b2f1355b114c73aab3f001` |
| Android phone runtime | `android-phone.png` | `eb55336514fa75f4d757073eb85d33029d866eadf87c2c59ca97c1d2a0ef0118` |
| Android tablet runtime | `android-tablet.png` | `835e64e565ef462ab61dfcec728d6553226b5caa92d41e103766d611fc3572fa` |
| iPhone Simulator runtime | `ios-iphone.png` | `bc33a0b6358ed3672fcb4ed57b38eafeee703d6dd922d98954ce996228bff00a` |
| iPad Simulator runtime | `ios-ipad.png` | `7a3c093a9a7fd94d270579a88a7667ed5aaf669a90a7715992fb77e5e2d50d1f` |
| Windows runtime | `windows-app.png` | `a1b1d24c3650513f7ac6023ba6c656ba8556d998e454f662eec36c5532e2f444` |
| macOS runtime | `macos-app.png` | `f1ea90ea8622b888428da744ad9767db75505312dfa3400145a6cd6ef6f25e5d` |

## Acceptance audit — Issue #11

1. **PASS** — R0.1–R7 regressions are green. Run 35356408860 `regression` completed the full test suite and R7.1 validation.
2. **PASS** — Shared architecture is preserved. `docs/multiplatform-architecture.md`; Capacitor and Tauri package the accepted shared React/domain/API application without duplicate engines.
3. **PASS** — Web production build works. The regression build and `web-dist` artifact succeeded on the audited SHA.
4. **EXTERNAL BLOCKER** — HTTPS deployment is reproducibly documented in `docs/deployment.md`, but a permanent staging/production hostname, DNS and hosting account action are not available in this repository/session. No live endpoint is claimed.
5. **PASS** — Production API deployment path is implemented and documented: environment contract, health checks, origin policy, migration order and server build are validated.
6. **PASS** — PostgreSQL migration path works. The audited regression job starts clean PostgreSQL and passes migrate, seed and `db:validate`.
7. **PASS** — PWA manifest, icons, install metadata and safe service worker build pass `validate:r7-1`; `web-dist` is retained.
8. **PASS** — Responsive phone UX is validated by Playwright evidence including `web-mobile.png`, `login-native.png`, `crm-mobile.png`, `project-mobile.png` and `proposal-mobile.png`.
9. **PASS** — Responsive tablet UX is validated by Playwright evidence plus real Android tablet and iPad Simulator runtime captures.
10. **PASS** — Desktop UX is preserved by regression/browser validation and real Windows/macOS runtime captures.
11. **PASS** — The Capacitor Android project builds successfully with Java 21/Gradle on the audited SHA.
12. **PASS** — A real debug APK is present and checksummed in the final manifest.
13. **PASS** — `bundleRelease` produces a real release AAB, retained and checksummed. Google Play signing/publication remains an external release action, not a software failure.
14. **PASS** — Android name/icons/branding are generated from the authoritative R7 logo and validated by the native configuration gate.
15. **PASS** — Android configuration has the minimal Capacitor permission baseline; no unnecessary camera/location/background permission is introduced.
16. **PASS** — Xcode compiles the Capacitor app for `iphonesimulator` with signing disabled and retains the simulator `.app`.
17. **PASS** — iPhone adaptive layout is validated by responsive evidence and a real iPhone Simulator launch/screenshot.
18. **PASS** — iPad adaptive layout is validated by responsive evidence and a real iPad Simulator launch/screenshot.
19. **PASS** — iOS bundle identity, name, icons, Capacitor configuration and safe-area/adaptive UI are validated.
20. **PASS** — Apple signing/store status is truthful: simulator/development readiness is demonstrated; TestFlight/App Store signing and publication are explicitly not claimed and require external Apple credentials.
21. **PASS** — Windows Tauri release builds successfully on `windows-2025`.
22. **PASS** — Real MSI and NSIS installers are produced, non-empty, individually required by the gate and checksummed.
23. **PASS** — Windows identity/icon/window dimensions are configured; the release executable was launched and `windows-app.png` captured.
24. **PASS** — Windows signing status is truthful: unsigned installers are demonstrated; trusted Authenticode signing is not claimed and requires an external private certificate.
25. **PASS** — macOS Tauri release builds successfully on `macos-15`.
26. **PASS** — The audited run produces an Apple Silicon/aarch64 app bundle and DMG.
27. **PASS** — The non-empty DMG is individually required by the manifest gate and checksummed.
28. **PASS** — Intel/universal support strategy is documented in `docs/desktop-release.md`.
29. **PASS** — macOS signing/notarization status is truthful: unsigned development artifacts are demonstrated; distribution signing/notarization is not claimed and requires external Apple credentials.
30. **PASS** — Native shells reuse the real R7 API/auth/session client. Login/logout/401 expiry and server session behavior pass the shared regression gate; packaged runtimes launch the same client.
31. **PASS** — Tenant isolation remains server-enforced and passes R7 regression plus DB validation.
32. **PASS** — RBAC remains server-enforced and passes Admin/Viewer boundary validation.
33. **PASS** — R4 internal economics confidentiality remains protected; Viewer redaction tests pass.
34. **PASS** — es-MX default, persisted en-US switching and restoration pass the shared packaged-client regression path.
35. **PASS** — Organization-driven branding remains configurable and the official R7 asset/hash is validated.
36. **PASS** — Offline/network/error states are explicit; the PWA strategy excludes API truth from stale caching and regression validates the state contract.
37. **PASS** — R7 optimistic concurrency and 409 conflict behavior remain green.
38. **PASS** — Navigation/deep-link allowlists, unsafe URL rejection, cookie-session model, CSP/webview baseline and absence of plaintext token persistence pass R7.1 validation.
39. **PASS** — Camera/photo, document/file, PDF open/share/save, system share, deep-link, browser, network, lifecycle and version adapter foundations exist under `src/platform`.
40. **PASS** — Production dependency audit, bundle secret scan and client/server environment separation pass on the audited SHA.
41. **PASS** — Unified version/API compatibility policy is implemented and tested at app version 0.7.1 / API compatibility 7.1.
42. **PASS** — Multiplatform CI and artifact collection succeed: all seven technical jobs plus the aggregate manifest job are green.
43. **PASS** — Representative Web, Android phone/tablet, iPhone/iPad Simulator, Windows and macOS evidence is captured. Store signing/publication and physical Apple-device distribution are explicitly separated as external actions.
44. **PASS** — Required architecture, deployment, mobile release, desktop release, environment and review documentation is complete; final manifest/checksums are retained.
45. **PASS** — Work stops for formal review. No merge to `main`, no Issue #11 closure and no R8 work occurred.

## Result

- **PASS:** 44
- **EXTERNAL BLOCKER:** 1
- **FAIL:** 0
- Technical gate: **green**
- External action still required for a live permanent HTTPS deployment: hosting/account, DNS and hostname configuration.
- Store publication, trusted Windows signing, Apple distribution signing/notarization and production credentials remain external release actions and are not falsely claimed as completed.

This review is an evidence/documentation record for the audited candidate SHA above. Any later commit containing only this review does not alter candidate code or artifacts; any code change requires a new full gate.
