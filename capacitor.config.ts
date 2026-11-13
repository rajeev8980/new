import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.newchat.app",
  appName: "New",
  webDir: "dist",
  android: {
    allowMixedContent: false,
  },
};

export default config;
