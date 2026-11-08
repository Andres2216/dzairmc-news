module.exports = {
  expo: {
    name: "DzairMC News",
    slug: "dzairmc-news",
    version: "1.3.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#111827"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.lakomess.dzairmcnews"
    },
    android: {
      package: "com.lakomess.dzairmcnews",
      versionCode: 13,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#111827"
      },
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "POST_NOTIFICATIONS",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "41707d6b-6bc7-4732-b7ca-89cce85cacce"
      },
      publisherInfo: {
        name: "DzairMC News",
        contactEmail: "contact@dzairmcnews.com",
        privacyPolicyUrl: "https://dzairmcnews.com/privacy-policy",
        facebookPageUrl: "https://www.facebook.com/dzairmcnews"
      },
      admob: {
        androidAppId: "ca-app-pub-4827532078352750~8947827391",
        bannerUnitId: "ca-app-pub-4827532078352750~5841140721",
        interstitialUnitId: "ca-app-pub-4827532078352750~7097523247",
        appOpenUnitId: "ca-app-pub-4827532078352750~7287692563"
      }
    },
    plugins: [
      "expo-font",
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-4827532078352750~8947827391",
          iosAppId: "ca-app-pub-4827532078352750~8947827391"
        }
      ]
    ]
  }
};