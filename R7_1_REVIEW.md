# R7.1 Review — Multiplatform App, Deployment & Distribution Foundation

Status: implementation gate in progress. R8 is not started. SolarERP is not used.

## Architecture
R0.1–R7 domain engines and the R7 Express/PostgreSQL backend remain authoritative. R7.1 adds distribution only: responsive shared React UX, PWA metadata, Capacitor mobile packaging, Tauri desktop packaging, and explicit platform adapters. No database/server secret belongs in a native client.

## Acceptance audit
1. ⏳ R0.1–R7 regressions — CI gate.
2. ✅ Shared architecture/no duplicate engines.
3. ⏳ Web production build — CI.
4. ⚠️ HTTPS deployment reproducible/documented; permanent host/domain requires external authorization.
5. ✅ Production API deployment path documented.
6. ⏳ PostgreSQL migration path — CI.
7. ✅ PWA manifest/install metadata.
8. ✅ Responsive phone UX.
9. ✅ Responsive tablet UX.
10. ✅ Desktop UX preserved.
11. ⏳ Android project/build — CI.
12. ⏳ Android debug APK — CI artifact.
13. ⏳ Android release AAB — release signing requires external keystore; unsigned build path to be validated.
14. ⏳ Android branding.
15. ⏳ Android permissions.
16. ⏳ iOS simulator compile — macOS CI.
17. ⏳ iPhone adaptive validation.
18. ⏳ iPad adaptive validation.
19. ⏳ iOS branding/config.
20. ✅ Apple signing/store status truthful: not claimed; external Apple credentials required.
21. ⏳ Windows desktop build.
22. ⏳ Windows installer artifact.
23. ⏳ Windows branding/window behavior.
24. ✅ Windows trusted signing not claimed; certificate external.
25. ⏳ macOS project build.
26. ⏳ Apple Silicon artifact requires arm64 build infrastructure.
27. ⏳ macOS distributable.
28. ✅ Intel/universal strategy documented.
29. ✅ Apple signing/notarization not claimed; credentials external.
30. ⏳ Native auth/session runtime validation.
31. ⏳ Tenant isolation regression.
32. ⏳ RBAC regression.
33. ⏳ R4 confidentiality regression.
34. ⏳ es-MX/en-US packaged validation.
35. ✅ Organization-driven branding preserved.
36. ✅ Explicit network/offline UI foundation.
37. ⏳ Optimistic concurrency regression.
38. ⏳ Secure storage/navigation/deep-link baseline.
39. ✅ Camera/file/PDF/share adapter contract.
40. ✅ No client secrets embedded by architecture/config policy.
41. ✅ Unified 0.7.1 version/compatibility strategy.
42. ⏳ Multiplatform CI/artifact collection.
43. ⏳ Runtime evidence as infrastructure permits.
44. ✅ Required architecture/release/deployment docs present; final evidence pending.
45. ⏳ Formal stop after final validation.

## External-account boundary
Permanent HTTPS hosting/domain/DNS, App Store/TestFlight credentials, Google Play publication/signing credentials, trusted Windows code-signing certificate, and Apple distribution signing/notarization are external account actions and are not represented as completed.
