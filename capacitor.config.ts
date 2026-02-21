import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ionicMovie.app',
  appName: 'movie-website',
  webDir: 'dist',
  server: {
    cleartext: true,
    allowNavigation: ["192.168.110.112:8080","192.168.110.112:8000"]
  }
};

export default config;
