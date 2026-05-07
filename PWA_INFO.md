# PWA and Android APK (PWABuilder)

Your app is now a fully functional Progressive Web App (PWA). This means it can be installed directly from the browser on Android and iOS, and it is ready for conversion to a native Android APK using **PWABuilder**.

## PWA Features
- **Installable**: Users will be prompted to "Add to Home Screen".
- **Offline Support**: Basic assets are cached for offline startup.
- **Standalone Mode**: Runs in its own window without browser UI.
- **App Icons**: High-quality SVG icons included.

## Generating an Android APK with PWABuilder

1.  **Deploy your app**: Ensure your app is hosted on a public HTTPS URL.
2.  **Go to [PWABuilder.com](https://www.pwabuilder.com/)**.
3.  **Enter your App URL** and click "Start".
4.  PWABuilder will analyze your manifest and service worker (both are already configured!).
5.  Click **"Package for Stores"** and select **Android**.
6.  Configure your package name (e.g., `com.ssstiktok.downloader`).
7.  **Generate and Download**: You will receive an `.apk` file ready for installation.

## Manual Capacitor Android Build
If you prefer a native Android Studio project, follow the instructions in `INSTALL_ANDROID.md`.

## Files Added
- `/public/manifest.json`: Web App Manifest.
- `/public/sw.js`: Service Worker for caching and offline support.
- `/public/icon.svg`: Vector icon for all device sizes.
