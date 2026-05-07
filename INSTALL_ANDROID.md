# Building for Android with Capacitor (V2 - Native Storage)

Your app is now optimized for Android with native file saving. Videos will be saved to your Gallery (SSSTikTok album) and Music to your Documents folder.

## Prerequisites
1.  **Android Studio** installed on your machine.
2.  **Android SDK** configured.

## Native Plugins Added
- `@capacitor/filesystem`: For reading/writing raw data to internal/external storage.
- `@capacitor-community/media`: For moving videos into the Android Gallery/Media index.

## Important Android Configuration

After running `npx cap add android`, you MUST update your `android/app/src/main/AndroidManifest.xml` to include:

```xml
<!-- Request storage permissions -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<!-- For Android 13+ (if needed) -->
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />

<application
    android:requestLegacyExternalStorage="true"
    ...
>
```

## Build Instructions

1.  **Build the Web project**:
    ```bash
    npm run build
    ```

2.  **Sync the project**:
    ```bash
    npm run cap:sync
    ```

3.  **Open in Android Studio**:
    ```bash
    npm run cap:open:android
    ```

4.  **Register Plugins**:
    In Capacitor 3+, plugins are auto-registered. If you are using an older hybrid setup, ensure `Filesystem` and `Media` are included.

## How it works (Android 10+)
- **Videos**: Uses `Media.saveVideo` which automatically triggers the Android Media Scanner to make files appear in the Gallery/Photos app.
- **Audio**: Saved to `Documents/SSSTikTok/Music/` using Scoped Storage compatible paths.
- **Progress**: Real-time progress is tracked via `fetch` streams before writing to native storage.
