import { AppState, AppStateStatus } from 'react-native';
import {
  InterstitialAd,
  AppOpenAd,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';
import Constants from 'expo-constants';

const admobConfig = Constants.expoConfig?.extra?.admob;

const INTERSTITIAL_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : admobConfig?.interstitialUnitId || TestIds.INTERSTITIAL;

const APP_OPEN_ID = __DEV__
  ? TestIds.APP_OPEN
  : admobConfig?.appOpenUnitId || TestIds.APP_OPEN;

const INACTIVITY_THRESHOLD_MS = 30000;

class AdMobService {
  private static instance: AdMobService;
  private interstitial: InterstitialAd | null = null;
  private appOpenAd: AppOpenAd | null = null;

  private isInterstitialLoaded = false;
  private isAppOpenLoaded = false;
  private isAdDisplaying = false;

  private articleCounter = 0;
  private lastBackgroundTime = 0;
  private appState: AppStateStatus = AppState.currentState;

  private constructor() {
    this.initializeAds();
    this.setupAppStateListener();
  }

  public static getInstance(): AdMobService {
    if (!AdMobService.instance) {
      AdMobService.instance = new AdMobService();
    }
    return AdMobService.instance;
  }

  private initializeAds(): void {
    this.preloadInterstitial();
    this.preloadAppOpenAd();
  }

  private preloadInterstitial(): void {
    try {
      this.interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
        keywords: ['news', 'media', 'algeria'],
      });

      this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
        this.isInterstitialLoaded = true;
      });

      this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        this.isInterstitialLoaded = false;
        this.isAdDisplaying = false;
        this.preloadInterstitial();
      });

      this.interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        this.isInterstitialLoaded = false;
        this.isAdDisplaying = false;
        console.warn('AdMob Interstitial Error:', error);
      });

      this.interstitial.load();
    } catch (error) {
      console.warn('Failed to construct Interstitial Ad:', error);
    }
  }

  private preloadAppOpenAd(): void {
    try {
      this.appOpenAd = AppOpenAd.createForAdRequest(APP_OPEN_ID, {
        keywords: ['news', 'breaking'],
      });

      this.appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
        this.isAppOpenLoaded = true;
      });

      this.appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
        this.isAppOpenLoaded = false;
        this.isAdDisplaying = false;
        this.preloadAppOpenAd();
      });

      this.appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
        this.isAppOpenLoaded = false;
        this.isAdDisplaying = false;
        console.warn('AdMob App Open Error:', error);
      });

      this.appOpenAd.load();
    } catch (error) {
      console.warn('Failed to construct App Open Ad:', error);
    }
  }

  public trackArticleOpened(): void {
    this.articleCounter += 1;
    if (this.articleCounter % 5 === 0) {
      this.showInterstitialIfAvailable();
    }
  }

  public showInterstitialIfAvailable(): void {
    if (this.isAdDisplaying) return;

    if (this.interstitial && this.isInterstitialLoaded) {
      try {
        this.isAdDisplaying = true;
        this.interstitial.show();
      } catch (err) {
        this.isAdDisplaying = false;
        console.warn('Error showing interstitial:', err);
      }
    }
  }

  public showAppOpenAdIfAvailable(): void {
    if (this.isAdDisplaying) return;

    if (this.appOpenAd && this.isAppOpenLoaded) {
      try {
        this.isAdDisplaying = true;
        this.appOpenAd.show();
      } catch (err) {
        this.isAdDisplaying = false;
        console.warn('Error showing App Open ad:', err);
      }
    }
  }

  private setupAppStateListener(): void {
    AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        this.appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const elapsed = Date.now() - this.lastBackgroundTime;
        if (elapsed >= INACTIVITY_THRESHOLD_MS) {
          this.showAppOpenAdIfAvailable();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        this.lastBackgroundTime = Date.now();
      }
      this.appState = nextAppState;
    });
  }
}

export const admobService = AdMobService.getInstance();
