const isProduction = process.env.APP_VARIANT === 'production';
const testAndroidAppId = 'ca-app-pub-3940256099942544~3347511713';
const testIosAppId = 'ca-app-pub-3940256099942544~1458002511';
const testBannerId = 'ca-app-pub-3940256099942544/9214589741';
const productionAppId = process.env.ADMOB_ANDROID_APP_ID;
const productionBannerId = process.env.ADMOB_ANDROID_BANNER_ID;

if (isProduction && (!productionAppId || !productionBannerId)) {
  throw new Error(
    'Production requires ADMOB_ANDROID_APP_ID and ADMOB_ANDROID_BANNER_ID.',
  );
}

module.exports = {
  name: 'DzairMC News',
  owner: 'dzairlakomess',
  slug: 'dzairmc-news',
  scheme: 'dzairmc',
  version: '1.1.1',
  platforms: ['android'],
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  icon: './assets/logo-app.png',
  splash: {
    image: './assets/logo-app.png',
    resizeMode: 'contain',
    backgroundColor: '#101010',
  },
  android: {
    package: 'com.lakomess.dzairmcnews',
    permissions: [],
    blockedPermissions: [
      'android.permission.READ_CONTACTS',
      'android.permission.WRITE_CONTACTS',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
    ],
    adaptiveIcon: {
      foregroundImage: './assets/logo-app.png',
      backgroundColor: '#101010',
    },
    allowBackup: false,
  },
  plugins: [
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          usesCleartextTraffic: false,
        },
      },
    ],
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: productionAppId ?? testAndroidAppId,
        iosAppId: testIosAppId,
      },
    ],
  ],
  extra: {
    youtubeChannelId: 'UC-k2FdaMuAw9FUrPLqkuXnw',
    youtubeUrl: 'https://www.youtube.com/@dzairmcnews',
    facebookUrl: 'https://www.facebook.com/share/1BcyzP9LLn/',
    privacyUrl: '',
    eas: {
      projectId: '41707d6b-6bc7-4732-b7ca-89cce85cacce',
    },
    admobBannerId: productionBannerId ?? testBannerId,
    adsAreTestOnly: !isProduction,
  },
};
