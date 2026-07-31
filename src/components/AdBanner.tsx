import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Constants from 'expo-constants';

const bannerUnitId = __DEV__
  ? TestIds.BANNER
  : Constants.expoConfig?.extra?.admob?.bannerUnitId || TestIds.BANNER;

export const AdBanner: React.FC = React.memo(() => {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={bannerUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => console.warn('Banner Ad Error:', error)}
      />
    </View>
  );
});

AdBanner.displayName = 'AdBanner';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
});
