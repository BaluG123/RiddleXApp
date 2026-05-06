/**
 * Internationalization Engine — Math Master v3.0
 * Supports 8 languages with persistent selection
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './translations/en';
import hi from './translations/hi';
import kn from './translations/kn';
import te from './translations/te';
import ta from './translations/ta';
import es from './translations/es';
import fr from './translations/fr';
import ar from './translations/ar';

const LANGUAGE_KEY = 'app_language';

const translations = { en, hi, kn, te, ta, es, fr, ar };

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

let currentLanguage = 'en';

const i18n = {
  /**
   * Initialize language from storage
   */
  async init() {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved && translations[saved]) {
        currentLanguage = saved;
      }
    } catch (e) {
      console.warn('Error loading language:', e);
    }
    return currentLanguage;
  },

  /**
   * Get current language code
   */
  getLanguage() {
    return currentLanguage;
  },

  /**
   * Set language and persist
   */
  async setLanguage(langCode) {
    if (translations[langCode]) {
      currentLanguage = langCode;
      await AsyncStorage.setItem(LANGUAGE_KEY, langCode);
      return true;
    }
    return false;
  },

  /**
   * Translate a key. Supports dot notation: t('home.title')
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    // Fallback to English
    if (value === undefined) {
      value = translations.en;
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          value = key; // Return key as last resort
          break;
        }
      }
    }

    if (typeof value !== 'string') return key;

    // Replace params: {{name}} → value
    return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : `{{${paramKey}}}`;
    });
  },
};

export default i18n;
