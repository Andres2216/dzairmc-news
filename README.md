# DzairMC News

Production-oriented Arabic news and video application for Android, built with
Expo SDK 56 and React Native 0.85.

## Included

- Arabic RTL feed, categories, search, video tab, bookmarks, and video detail
- Loading, offline, empty, refresh, and invalid-link states
- Persistent bookmarks
- Explicit notification opt-in
- Latest videos from the official public YouTube Atom feed
- Facebook page inside the app with an always-available external-open action
- AdMob banner integration with UMP consent
- Test ads for preview builds and a production-ID build guard
- No YouTube API key or custom content server required
- Android permission minimization and release documentation

## Local setup

```powershell
npm.cmd install
npx.cmd expo-doctor@latest
npm.cmd run check
```

The AdMob native module requires a native build; it does not run in Expo Go.

## Content sources

The app reads the public YouTube Atom feed for channel
`UC-k2FdaMuAw9FUrPLqkuXnw`. Each item is validated, limited, cached locally,
and opened through its original `youtube.com/watch` URL.

Facebook is displayed in a restricted WebView and can also be opened in the
Facebook app or browser. Facebook can require the user to sign in and may
occasionally refuse embedded access; the external action remains available.

## Android builds

```powershell
$env:EAS_NO_VCS="1"
npx.cmd eas-cli@latest build --platform android --profile preview --clear-cache
npx.cmd eas-cli@latest build --platform android --profile production --clear-cache
```

The preview profile builds an APK with Google test ads. The production profile
builds an AAB and intentionally fails unless `ADMOB_ANDROID_APP_ID` and
`ADMOB_ANDROID_BANNER_ID` are present in the build environment.
