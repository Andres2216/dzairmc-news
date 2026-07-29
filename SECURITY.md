# Security model

No application can be guaranteed to be impossible to compromise. This project
uses layered controls to reduce attack surface and limit damage.

## Client controls

- No API keys, Facebook tokens, admin credentials, or signing keys in the app.
- HTTPS-only runtime configuration and links.
- External links restricted to an explicit host allowlist.
- The YouTube feed is treated as untrusted input and parsed with a maintained
  XML parser, then validated and length-limited before rendering.
- The Facebook WebView accepts HTTPS navigation only on Facebook-owned hosts.
- Network requests use timeouts and item limits.
- Bookmarks contain public content IDs only. They are stored in AsyncStorage;
  sensitive data must never be added there.
- Android backup is disabled and unused permissions are explicitly blocked.
- Production builds fail when production AdMob IDs are absent.
- AdMob starts only after the Google consent flow allows requests.

## Content controls

- No YouTube or Facebook credential is bundled in the application.
- YouTube videos retain their original source URL and publisher attribution.
- Facebook is isolated to its own view and always offers an external fallback.

## Release controls

- Store the Android upload key outside the repository.
- Enable Play App Signing and two-step verification on all owner accounts.
- Review `npm audit`, Expo Doctor, and dependency changes before every release.
- Use test ads in all development and review builds.
- Rotate any credential immediately if it is exposed.

## Reporting

Add the final security contact email and disclosure process before publishing.
