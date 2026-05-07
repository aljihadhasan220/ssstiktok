import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ssstiktok.downloader',
  appName: 'SSSTikTok',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Clipboard: {
      // Custom clipboard settings if needed
    }
  }
};

export default config;
