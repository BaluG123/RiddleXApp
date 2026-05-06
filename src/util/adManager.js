/**
 * Ad Manager — Math Master v3.0
 * Smart monetization strategy: Rewarded Ads for utility, Interstitials for game over
 */
import { Platform } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Production Ad IDs (Replace these with your real AdMob IDs when releasing)
const AD_IDS = {
  android: {
    interstitial: 'ca-app-pub-3940256099942544/1033173712', // Test ID
    rewarded: 'ca-app-pub-3940256099942544/5224354917', // Test ID
  },
  ios: {
    interstitial: 'ca-app-pub-3940256099942544/4411468910', // Test ID
    rewarded: 'ca-app-pub-3940256099942544/1712485313', // Test ID
  }
};

const currentIds = Platform.OS === 'android' ? AD_IDS.android : AD_IDS.ios;

class AdManager {
  constructor() {
    this.rewardedAd = null;
    this.interstitialAd = null;
    this.rewardedLoaded = false;
    this.interstitialLoaded = false;
    this._init();
  }

  _init() {
    this._createRewarded();
    this._createInterstitial();
  }

  _createRewarded() {
    this.rewardedAd = RewardedAd.createForAdRequest(currentIds.rewarded, {
      requestNonPersonalizedAdsOnly: true,
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      this.rewardedLoaded = true;
      console.log('Rewarded Ad Loaded');
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('User earned reward: ', reward);
    });

    this.rewardedAd.load();
  }

  _createInterstitial() {
    this.interstitialAd = InterstitialAd.createForAdRequest(currentIds.interstitial, {
      requestNonPersonalizedAdsOnly: true,
    });

    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      this.interstitialLoaded = true;
      console.log('Interstitial Ad Loaded');
    });

    this.interstitialAd.load();
  }

  /**
   * Show Rewarded Ad for a specific reward type
   * @returns {Promise<boolean>} True if reward earned
   */
  showRewardedAd() {
    return new Promise((resolve) => {
      if (!this.rewardedLoaded) {
        console.warn('Rewarded ad not loaded yet');
        this.rewardedAd.load();
        resolve(false);
        return;
      }

      const unsubscribeEarned = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          unsubscribeEarned();
          unsubscribeClosed();
          resolve(true);
        }
      );

      const unsubscribeClosed = this.rewardedAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          unsubscribeEarned();
          unsubscribeClosed();
          this.rewardedLoaded = false;
          this.rewardedAd.load(); // Preload next
          resolve(false);
        }
      );

      this.rewardedAd.show();
    });
  }

  /**
   * Shortcut for hints/solutions
   */
  async showRewardedAdForHint() {
    return await this.showRewardedAd();
  }

  async showRewardedAdForSolution() {
    return await this.showRewardedAd();
  }

  /**
   * Show Interstitial (e.g., after 5 games)
   */
  showInterstitialAd() {
    if (this.interstitialLoaded) {
      this.interstitialAd.show();
      this.interstitialLoaded = false;
      this.interstitialAd.load(); // Preload next
    } else {
      this.interstitialAd.load();
    }
  }
}

export default new AdManager();
