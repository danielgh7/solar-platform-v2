# R7.1 Review — Multiplatform App, Deployment & Distribution Foundation

Status: **ready for formal audit** on `r7.1-issue-11`. R8 has not started. SolarERP is not used.

## Audited candidate

- Candidate SHA: `7e34aeeb7bcc67b3cc86ae1fa54fc9b6472addcf`
- Workflow run: [36046515272](https://github.com/danielgh7/solar-platform-v2/actions/runs/36046515272)
- Result: **success**
- Jobs: `regression`, `android`, `android-runtime (pixel_7)`, `android-runtime (pixel_tablet)`, `ios`, `desktop (windows-2025)`, `desktop (macos-15)`, and `manifest` all completed successfully.
- Final artifact manifest: `r7-1-final-manifest`, artifact ID `10829456504`, archive digest `sha256:4ebc8d181dfc4230c3ae9505e756ea76cf5cc88078e2491e4a4ac8f123c2d1d2`.
- `artifact-manifest.json` identifies candidate `7e34aeeb7bcc67b3cc86ae1fa54fc9b6472addcf` and run `36046515272`.
- Manifest integrity: 94 files and 94 SHA-256 entries. The manifest gate downloaded all nine upstream artifacts, required each platform deliverable individually, and completed successfully.

Representative final artifacts:

| Artifact | Evidence | SHA-256 |
|---|---|---|
| Android APK | `android-builds/app/build/outputs/apk/debug/app-debug.apk` | `8205de94f6a452a20c274e15208835650acd1df469559ac3592a1bc395625c8a` |
| Android AAB | `android-builds/app/build/outputs/bundle/release/app-release.aab` | `71f8cccfa684fefdb7bfb949d607ca6874b1db36f525502865445703bde56872` |
| Windows MSI | `Buenos días sol_0.7.1_x64_en-US.msi` | `606094099a28d4aac9505012a1b9f2f041bb1710f66461068c10bc0e64d216c9` |
| Windows NSIS | `Buenos días sol_0.7.1_x64-setup.exe` | `0f35143f659f1999100086535289a3224da87d49fd834fbd94c4f6aab6b16082` |
| macOS DMG | `Buenos días sol_0.7.1_aarch64.dmg` | `2eba3badbbce93e16af83f3a7ad859d9f3e1b0601ed0ff9dbcfc485f182b4ec0` |
| Android phone runtime | `android-phone.png` | `65cf32b4f89d1e9c4993134a80e1ea18064f72d2150819ef60e57d78c044d307` |
| Android tablet runtime | `android-tablet.png` | `a37ec690cd4bea7f22df68483aa56a9270f5218a01e7e66bc4b5dce1abe384a9` |
| iPhone Simulator runtime | `ios-iphone.png` | `65cffc284531d21b5b1bd164d138abe748e52eaea21d2c99dcdba9a52278f642` |
| iPad Simulator runtime | `ios-ipad.png` | `73ce9af77e806da45a6963770d5f7fef259927b57abbbd67905edbd41ac2517c` |
| Windows runtime | `windows-app.png` | `3399310f9bb21fb4a127a7c05a3ac1b917ad27b473c6f50ec84f0d49113cc7cb` |
| macOS runtime | `macos-app.png` | `da54b8b1d8fddedc519c01bb20a9d2c24593a71498f5e3e00fc6961ec23f710d` |

## Acceptance audit — Issue #11

1. **PASS** — R0.1–R7 regressions are green. Run 36046515272 `regression` completed the full test suite and R7.1 validation.
2. **PASS** — Shared architecture is preserved. `docs/multiplatform-architecture.md`; Capacitor and Tauri package the accepted shared React/domain/API application without duplicate engines.
3. **PASS** — Web production build works. The regression build and `web-dist` artifact succeeded on the audited SHA.
4. **PASS** — The real Render deployment at [https://solar-platform-v2.onrender.com](https://solar-platform-v2.onrender.com) was validated on 2026-09-25 against this candidate: Web/PWA and API are served over HTTPS with HSTS; `/api/health` returns `200`; PostgreSQL-backed authentication, migrations, sessions, tenant isolation, RBAC/economics confidentiality, locale persistence, branding and the representative R1–R7 flow work. Project `SOL-2026-206817` was created through the published wizard, reopened with its own persisted R1 baseline, and remained after a hard reload. Approved-origin CORS headers are emitted only for the production origin, an unauthenticated organization request returns `401`, and no application-origin console/API errors were observed.
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

- **PASS:** 45
- **EXTERNAL BLOCKER:** 0
- **FAIL:** 0
- Technical gate: **green**
- Live deployment validated: [https://solar-platform-v2.onrender.com](https://solar-platform-v2.onrender.com); operational details and evidence are recorded in `docs/deployment.md`.
- Store publication, trusted Windows signing, Apple distribution signing/notarization and production credentials remain external release actions and are not falsely claimed as completed.

This review is an evidence/documentation record for the audited candidate SHA above. Any later commit containing only this review does not alter candidate code or artifacts; any code change requires a new full gate.
