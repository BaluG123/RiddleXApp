// HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  responsiveFontSize as fs
} from "react-native-responsive-dimensions";
import { Linking } from 'react-native';
import SocialIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import VersionCheck from 'react-native-version-check';

const Homescreen = ({ navigation }) => {
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);

  // const adUnitId2 = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2627956667785383/2707235997';

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleOtherAppClick = (appUrl) => {
    Linking.openURL(appUrl);
  };

  const checkAppVersion = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion({
        provider: 'playStore', // Specify 'playStore' for Android
      });

      const currentVersion = await VersionCheck.getCurrentVersion();

      if (latestVersion > currentVersion) {
        // Show update message or popup
        setShowUpdateMessage(true);
      }
    } catch (error) {
      console.error('Error checking app version:', error);
    }
  };

  const handleBackPress = () => {
    // Check if the current route is the HomeScreen
    if (navigation.isFocused()) {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', onPress: () => { }, style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp(), style: 'destructive', },
        ],
        {
          cancelable: false,
          style: 'default', // Customize the Alert dialog style
          titleStyle: { fontSize: 24, fontWeight: 'bold' }, // Customize the title style
          messageStyle: { fontSize: 16 }, // Customize the message style
        },
      );

      // Return true to prevent default behavior (exit the app) only on the HomeScreen
      return true;
    }

    // Return false to allow the default back behavior on other screens
    return false;
  };

  const handleLevelsPress = () => {
    navigation.navigate('LevelScreen');
  };

  const handleSocialMediaClick = (socialMedia) => {
    // Define social media URLs
    const socialMediaUrls = {
      instagram: 'https://www.instagram.com/math.riddles_x',
      twitter: 'https://twitter.com/WebDeveloper20',
      // Add other social media URLs as needed
    };

    // Check if the selected social media exists in the URLs
    if (socialMediaUrls[socialMedia]) {
      // Open the social media URL
      Linking.openURL(socialMediaUrls[socialMedia]);
    } else {
      // Handle the case when the social media URL is not defined
      console.warn(`Social media URL for ${socialMedia} is not defined.`);
    }
  };

  const handleClearDataClick = async () => {
    // Show an Alert to confirm clearing data
    Alert.alert(
      'Clear Data ?',
      'If you clear the data, you will restart the game from the first level.',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              // Clear AsyncStorage data
              await AsyncStorage.clear();
              // Optionally, you can perform additional actions after clearing data
              console.log('Data cleared successfully');
            } catch (error) {
              console.error('Error clearing data:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  {showUpdateMessage && (
    <View>
      <Text>New update available! Update now for the latest features.</Text>
      <TouchableOpacity
        onPress={() => {
          // Open Play Store for the update
          VersionCheck.openAppStore({
            appName: 'Math Riddles',
            appStoreCountry: 'IN',
          });
        }}
      >
        <Text>Update Now</Text>
      </TouchableOpacity>
    </View>
  )}


  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2627956667785383/8571195943';


  return (
    <View style={styles.container}>

      <Text style={styles.appName}>Math Riddles</Text>
      <TouchableOpacity onPress={handleLevelsPress}>
        <View style={styles.playIconContainer}>
          <Icon name="play-arrow" size={32} color="black" />
        </View>
      </TouchableOpacity>
      <Text style={styles.optionText} onPress={handleLevelsPress}>
        Levels
      </Text>
      <Text style={{ color: 'white', fontSize: fs(2.5), fontWeight: 200 }}>Follow Us</Text>
      <View style={styles.socialMediaRow}>
        <SocialIcon
          name="instagram"
          size={24}
          color="#FFFFFF"
          style={styles.socialMediaIcon}
          onPress={() => handleSocialMediaClick('instagram')}
        />
        <Text style={styles.socialMediaText} onPress={() => handleSocialMediaClick('instagram')}>
          Instagram
        </Text>
      </View>
      {/* Twitter */}
      <View style={styles.socialMediaRow}>
        <SocialIcon
          name="twitter"
          size={24}
          color="#FFFFFF"
          style={styles.socialMediaIcon}
          onPress={() => handleSocialMediaClick('twitter')}
        />
        <Text style={styles.socialMediaText} onPress={() => handleSocialMediaClick('twitter')}>
          Twitter
        </Text>
      </View>
      <View style={styles.socialMediaRow}>
        <Icon
          name="restart-alt"
          size={24}
          color="#FFFFFF"
          style={styles.socialMediaIcon}
          onPress={() => handleSocialMediaClick('twitter')}
        />
        <Text style={styles.clearDataText} onPress={handleClearDataClick}>
          Restart
        </Text>
      </View>
      <View style={styles.socialMediaRow}>
        <Icon
          name="cancel"
          size={24}
          color="#FFFFFF"
          style={styles.socialMediaIcon}
          onPress={() => handleSocialMediaClick('twitter')}
        />
        <Text style={styles.optionText} onPress={handleBackPress}>Exit</Text>
      </View>
      <TouchableOpacity style={styles.otherAppContainer} onPress={() => handleOtherAppClick('https://play.google.com/store/apps/details?id=com.gymexercises')}>
        <Text style={styles.otherAppText}>Other Apps</Text>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
  },
  appName: {
    flex: 0,
    fontSize: fs(2.8),
    fontWeight: '200',
    marginBottom: hp(2),
    color: '#FFFFFF'
  },
  playIconContainer: {
    backgroundColor: '#FFFFFF', // Customize the background color
    borderRadius: hp(4), // Half of the size for a circular shape
    padding: hp(2),
    marginBottom: wp(0),
  },
  optionsContainer: {
    alignItems: 'center',
  },
  optionText: {
    fontSize: fs(2.5),
    marginVertical: hp(0.5),
    color: '#FFFFFF',
    fontWeight: '200',
    // marginBottom:hp(10)
  },
  logo: {
    width: hp(32), // Adjust the width as needed
    height: hp(32), // Adjust the height as needed
    resizeMode: 'contain', // Choose the resizeMode that fits your image
    marginBottom: hp(2),
    borderWidth: hp(0.1),
    borderColor: '#FFFFFF'
  },
  socialMediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.5),
  },
  socialMediaIcon: {
    marginRight: wp(1),
  },
  socialMediaText: {
    fontSize: fs(2),
    color: '#FFFFFF',
    fontWeight: '200',
  },
  clearDataText: {
    fontSize: fs(2.5),
    marginVertical: hp(0.5),
    color: '#FFFFFF', // Red color for emphasis
    fontWeight: '200',
  },
  otherAppContainer: {
    marginTop: hp(1.5),
    alignItems: 'center',
  },
  otherAppText: {
    fontSize: fs(2.5),
    color: '#FFFFFF',
    fontWeight: '200',
    textDecorationLine: 'underline', // Add underline for better visibility
  },
});

export default Homescreen;
