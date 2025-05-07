
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.db673c33564d4c4ea95a44296f33aae1',
  appName: 'cog-recovery-hub',
  webDir: 'dist',
  server: {
    url: 'https://db673c33-564d-4c4e-a95a-44296f33aae1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
