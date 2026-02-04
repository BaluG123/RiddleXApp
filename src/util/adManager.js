/**
 * Ad Manager Utility - FIXED VERSION
 * Handles ad loading, display, and error handling
 * Optimized for monetization with multiple ad types
 */

import { 
  RewardedAd, 
  RewardedAdEventType, 
  TestIds, 
  RewardedInterstitialAd,
  AppOpenAd,
  InterstitialAd,
  AdEventType 
} from 'react-native-google-mobile-ads';

const AD_UNIT_IDS = {
  HINT_REWARDED: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2627956667785383/1872666477',
  SOLUTION_INTERSTITIAL: __DEV__ ? TestIds.REWARDED_INTERSTITIAL : 'ca-app-pub-2627956667785383/6921813171',
  APP_OPEN: __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-2627956667785383/3774248840',
  INTERSTITIAL: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-2627956667785383/1234567890', // Add your interstitial ID
};

const AD_LOAD_TIMEOUT = 8000; // 8 seconds
const AD_KEYWORDS = ['education', 'learning', 'math', 'puzzles', 'games', 'riddles'];

class AdManager {
  constructor() {
    this.rewardedAd = null;
    this.rewardedInterstitialAd = null;
    this.appOpenAd = null;
    this.interstitialAd = null;
    
    this.isRewardedLoaded = false;
    this.isInterstitialLoaded = false;
    this.isAppOpenLoaded = false;
    this.isInterstitialAdLoaded = false;
    
    this.adLoadTimeouts = {};
    this.adShowCount = 0;
    this.lastAdShowTime = 0;
  }

  /**
   * Initialize all ads
   */
  initializeAds() {
    try {
      this.createRewardedAd();
      this.createRewardedInterstitialAd();
      this.createAppOpenAd();
      this.createInterstitialAd();
    } catch (error) {
      console.warn('Error initializing ads:', error);
    }
  }

  /**
   * Create rewarded ad for hints
   */
  createRewardedAd() {
    try {
      this.rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.HINT_REWARDED, {
        keywords: AD_KEYWORDS,
      });

      // Use correct event type
      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        this.isRewardedLoaded = true;
        this.clearAdTimeout('rewarded');
        console.log('Rewarded ad loaded');
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward:', reward);
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.CLOSED, () => {
        this.isRewardedLoaded = false;
        this.loadRewardedAd();
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
        console.warn('Rewarded ad error:', error);
        this.isRewardedLoaded = false;
      });

      this.loadRewardedAd();
    } catch (error) {
      console.warn('Error creating rewarded ad:', error);
    }
  }

  /**
   * Create rewarded interstitial ad for solutions
   */
  createRewardedInterstitialAd() {
    try {
      this.rewardedInterstitialAd = RewardedInterstitialAd.createForAdRequest(
        AD_UNIT_IDS.SOLUTION_INTERSTITIAL,
        { keywords: AD_KEYWORDS }
      );

      this.rewardedInterstitialAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        this.isInterstitialLoaded = true;
        this.clearAdTimeout('interstitial');
        console.log('Rewarded interstitial ad loaded');
      });

      this.rewardedInterstitialAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward:', reward);
      });

      this.rewardedInterstitialAd.addAdEventListener(RewardedAdEventType.CLOSED, () => {
        this.isInterstitialLoaded = false;
        this.loadRewardedInterstitialAd();
      });

      this.rewardedInterstitialAd.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
        console.warn('Rewarded interstitial error:', error);
        this.isInterstitialLoaded = false;
      });

      this.loadRewardedInterstitialAd();
    } catch (error) {
      console.warn('Error creating rewarded interstitial ad:', error);
    }
  }

  createAppOpenAd() {
    try {
      this.appOpenAd = AppOpenAd.createForAdRequest(AD_UNIT_IDS.APP_OPEN, {
        keywords: AD_KEYWORDS,
      });

      this.appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
        this.isAppOpenLoaded = true;
        this.clearAdTimeout('appOpen');
        console.log('✅ App open ad loaded');
      });

      this.appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('App open ad closed');
        this.isAppOpenLoaded = false;
        this.loadAppOpenAd();
      });

      this.appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn('App open ad error:', error);
        this.isAppOpenLoaded = false;
      });

      this.loadAppOpenAd();
    } catch (error) {
      console.warn('Error creating app open ad:', error);
    }
  }

  /**
   * Create interstitial ad (shown between levels)
   */
  createInterstitialAd() {
    try {
      this.interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
        keywords: AD_KEYWORDS,
      });

      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        this.isInterstitialAdLoaded = true;
        this.clearAdTimeout('interstitialAd');
        console.log('Interstitial ad loaded');
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        this.isInterstitialAdLoaded = false;
        this.loadInterstitialAd();
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn('Interstitial ad error:', error);
        this.isInterstitialAdLoaded = false;
      });

      this.loadInterstitialAd();
    } catch (error) {
      console.warn('Error creating interstitial ad:', error);
    }
  }

  /**
   * Load rewarded ad
   */
  loadRewardedAd() {
    if (this.isRewardedLoaded) return;

    this.adLoadTimeouts['rewarded'] = setTimeout(() => {
      console.warn('Rewarded ad load timeout');
      this.isRewardedLoaded = false;
    }, AD_LOAD_TIMEOUT);

    try {
      this.rewardedAd.load();
    } catch (error) {
      console.warn('Error loading rewarded ad:', error);
    }
  }

  /**
   * Load rewarded interstitial ad
   */
  loadRewardedInterstitialAd() {
    if (this.isInterstitialLoaded) return;

    this.adLoadTimeouts['interstitial'] = setTimeout(() => {
      console.warn('Interstitial ad load timeout');
      this.isInterstitialLoaded = false;
    }, AD_LOAD_TIMEOUT);

    try {
      this.rewardedInterstitialAd.load();
    } catch (error) {
      console.warn('Error loading rewarded interstitial ad:', error);
    }
  }

  loadAppOpenAd() {
    if (this.isAppOpenLoaded) return;

    this.adLoadTimeouts['appOpen'] = setTimeout(() => {
      console.warn('⏱️ App open ad load timeout');
      this.isAppOpenLoaded = false;
    }, 12000);

    try {
      console.log('Loading app open ad...');
      this.appOpenAd.load();
    } catch (error) {
      console.warn('Error loading app open ad:', error);
    }
  }

  /**
   * Load interstitial ad
   */
  loadInterstitialAd() {
    if (this.isInterstitialAdLoaded) return;

    this.adLoadTimeouts['interstitialAd'] = setTimeout(() => {
      console.warn('Interstitial ad load timeout');
      this.isInterstitialAdLoaded = false;
    }, AD_LOAD_TIMEOUT);

    try {
      this.interstitialAd.load();
    } catch (error) {
      console.warn('Error loading interstitial ad:', error);
    }
  }

  async showAppOpenAd() {
    try {
      console.log('Checking app open ad loaded:', this.isAppOpenLoaded);
      if (this.isAppOpenLoaded) {
        console.log('🎬 Showing app open ad...');
        await this.appOpenAd.show();
        this.adShowCount++;
        this.lastAdShowTime = Date.now();
        console.log('✅ App open ad shown successfully');
        return true;
      } else {
        console.log('⚠️ App open ad not loaded yet');
        return false;
      }
    } catch (error) {
      console.warn('Error showing app open ad:', error);
      return false;
    }
  }

  /**
   * Show interstitial ad (between levels)
   */
  async showInterstitialAd() {
    try {
      // Show interstitial every 3 levels
      if (this.adShowCount % 3 === 0 && this.isInterstitialAdLoaded) {
        await this.interstitialAd.show();
        this.adShowCount++;
        this.lastAdShowTime = Date.now();
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Error showing interstitial ad:', error);
      return false;
    }
  }

  async showRewardedAdForHint() {
    try {
      console.log('Attempting to show rewarded ad for hint...');
      if (this.isRewardedLoaded) {
        console.log('Ad loaded, showing...');
        await this.rewardedAd.show();
        return true;
      } else {
        console.log('Ad not loaded, attempting to load...');
        await this.rewardedAd.load();
        
        let waitTime = 0;
        while (!this.isRewardedLoaded && waitTime < 5000) {
          await new Promise(resolve => setTimeout(resolve, 500));
          waitTime += 500;
        }
        
        if (this.isRewardedLoaded) {
          console.log('Ad loaded after wait, showing...');
          await this.rewardedAd.show();
          return true;
        } else {
          console.log('Ad still not loaded, showing content without ad');
          return true;
        }
      }
    } catch (error) {
      console.warn('Error showing rewarded ad:', error);
      return true;
    }
  }

  async showRewardedInterstitialAdForSolution() {
    try {
      console.log('Attempting to show interstitial ad for solution...');
      if (this.isInterstitialLoaded) {
        console.log('Ad loaded, showing...');
        await this.rewardedInterstitialAd.show();
        return true;
      } else {
        console.log('Ad not loaded, attempting to load...');
        await this.rewardedInterstitialAd.load();
        
        let waitTime = 0;
        while (!this.isInterstitialLoaded && waitTime < 5000) {
          await new Promise(resolve => setTimeout(resolve, 500));
          waitTime += 500;
        }
        
        if (this.isInterstitialLoaded) {
          console.log('Ad loaded after wait, showing...');
          await this.rewardedInterstitialAd.show();
          return true;
        } else {
          console.log('Ad still not loaded, showing content without ad');
          return true;
        }
      }
    } catch (error) {
      console.warn('Error showing interstitial ad:', error);
      return true;
    }
  }

  /**
   * Clear ad timeout
   */
  clearAdTimeout(adType) {
    if (this.adLoadTimeouts[adType]) {
      clearTimeout(this.adLoadTimeouts[adType]);
      delete this.adLoadTimeouts[adType];
    }
  }

  /**
   * Cleanup
   */
  cleanup() {
    Object.values(this.adLoadTimeouts).forEach(timeout => clearTimeout(timeout));
    this.adLoadTimeouts = {};
  }
}

export default new AdManager();
