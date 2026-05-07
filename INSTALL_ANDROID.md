# Building for Android with Capacitor

Your app is now configured with Capacitor to run as a native Android application.

## Prerequisites
1.  **Android Studio** installed on your machine.
2.  **Android SDK** configured.

## Build Instructions

1.  **Build the Web project**:
    ```bash
    npm run build
    ```

2.  **Add the Android platform** (first time only):
    ```bash
    npx cap add android
    ```

3.  **Sync the project** (run this every time you change the React code):
    ```bash
    npm run cap:sync
    ```

4.  **Open in Android Studio**:
    ```bash
    npm run cap:open:android
    ```

5.  **Build the APK/Bundle** in Android Studio:
    - Go to `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

## Native Features Integrated
- **Clipboard**: The "Paste" button uses native Android clipboard APIs.
- **Browser**: Fallback downloads open in the native Chrome custom tab.
- **Internet Permissions**: Automatically handled by Capacitor.
- **File Access**: Downloads are handled via blob stream for better compatibility.

## Icons and Splash Screens
To generate resources, you can use `@capacitor/assets`:
```bash
npx @capacitor/assets generate --android
```
Place your source icon in `assets/logo.png`.
