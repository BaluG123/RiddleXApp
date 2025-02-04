import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, BackHandler, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MathIcon from 'react-native-vector-icons/FontAwesome5';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { responsiveFontSize as fs } from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import VersionCheck from 'react-native-version-check';
import FAIcon from 'react-native-vector-icons/FontAwesome';

const Homescreen = ({ navigation }) => {
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    checkForUpdates();
    return () => backHandler.remove();
  }, []);

  const checkForUpdates = async () => {
    try {
      const updateNeeded = await VersionCheck.needUpdate();
      setShowUpdateMessage(updateNeeded.isNeeded);
    } catch (error) {
      console.error('Update check failed:', error);
    }
  };

  const handleBackPress = () => {
    if (navigation.isFocused()) {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp(), style: 'destructive' },
        ],
        { cancelable: false }
      );
      return true;
    }
    return false;
  };

  const mathOperations = [
    { title: "Riddles", icon: "brain", color: "#FF6B6B", navigate: 'LevelScreen' },
    { title: "Addition", icon: "plus", color: "#4ECDC4", navigate: 'AdditionScreen' },
    { title: "Subtraction", icon: "minus", color: "#45B7D1", navigate: 'SubtractionScreen' },
    { title: "Multiplication", icon: "times", color: "#96CEB4", navigate: 'MultiplicationScreen' },
    { title: "Division", icon: "divide", color: "#FFEEAD", navigate: 'DivisionScreen' },
    { title: "Mixed", icon: "random", color: "#D4A5A5", navigate: 'MixedScreen' },
    { title: "Time Challenge", icon: "stopwatch", color: "#FF9F68", navigate: 'TimeChallengeScreen' },
    { title: "Geometry", icon: "shapes", color: "#8E44AD", navigate: 'GeometryScreen    ' },
    { title: "Fractions", icon: "pizza-slice", color: "#F1C40F", navigate: 'FractionScreen' },
    { title: "Exponents", icon: "superscript", color: "#E67E22", navigate: 'ExponentScreen' },
    { title: "Word Problems", icon: "comment-dots", color: "#7F8C8D", navigate: 'WordProblemsScreen' },
    { title: "Logic Puzzles", icon: "puzzle-piece", color: "#D35400", navigate: 'LogicPuzzlesScreen' },
    { title: "Measurement", icon: "ruler-combined", color: "#2ECC71", navigate: 'MeasurementScreen' },
    { title: "Algebra Basics", icon: "cube", color: "#9B59B6", navigate: 'AlgebraScreen' },
    { title: "Number Patterns", icon: "wave-square", color: "#1ABC9C", navigate: 'PatternsScreen' },
    { title: "Money Math", icon: "coins", color: "#27AE60", navigate: 'MoneyMathScreen' },
    { title: "Equations", icon: "balance-scale", color: "#2980B9", navigate: 'EquationsScreen' },
    { title: "Probability", icon: "dice", color: "#C0392B", navigate: 'ProbabilityScreen' },
    { title: "Roots", icon: "square-root-alt", color: "#E74C3C", navigate: 'RootsScreen' },
    { title: "Statistics", icon: "chart-bar", color: "#A8D8EA", navigate: 'StatisticsScreen' },
  ];

  const MathSection = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.sectionContainer, { backgroundColor: color }]} onPress={onPress}>
      <MathIcon name={icon} size={hp(4)} color="#2C3E50" style={styles.sectionIcon} />
      <Text style={styles.sectionText}>{title}</Text>
    </TouchableOpacity>
  );

  const handleClearData = async () => {
    Alert.alert(
      'Reset Progress',
      'This will reset all your progress and scores. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'Progress has been reset');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset progress');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const socialLinks = [
    { name: 'instagram', url: 'https://www.instagram.com/math.riddles_x' },
    { name: 'twitter', url: 'https://twitter.com/WebDeveloper20' },
    { name: 'whatsapp', url: 'whatsapp://send?text=Check%20out%20Math%20Master%20app!%20Download%20it%20from%20Play%20Store:%20https://play.google.com/store/apps/details?id=com.riddlex&pli=1' + VersionCheck.getPackageName() },
  ];

  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2627956667785383/8571195943';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Math Master</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          {mathOperations.map((operation, index) => (
            <MathSection
              key={index}
              title={operation.title}
              icon={operation.icon}
              color={operation.color}
              onPress={() => navigation.navigate(operation.navigate)}
            />
          ))}
        </View>
        <View style={styles.socialContainer}>
          {socialLinks.map((social, index) => (
           <TouchableOpacity
           key={index}
           style={styles.socialButton}
           onPress={() => Linking.openURL(social.url)}
         >
           <FAIcon name={social.name} size={hp(3)} color="#ECF0F1" />
         </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={handleClearData}>
            <Icon name="refresh" size={hp(2.5)} color="#E74C3C" />
            <Text style={styles.footerButtonText}>Reset Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={handleBackPress}>
            <Icon name="exit-to-app" size={hp(2.5)} color="#95A5A6" />
            <Text style={styles.footerButtonText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.adContainer}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>

      {showUpdateMessage && (
        <View style={styles.updateBanner}>
          <Text style={styles.updateText}>New Version Available!</Text>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => VersionCheck.openAppStore({ appName: 'Math Master' })}
          >
            <Text style={styles.updateButtonText}>Update Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: hp(2),
    backgroundColor: '#34495E',
    borderBottomWidth: 1,
    borderBottomColor: '#3B536F',
  },
  appName: {
    fontSize: fs(4),
    color: '#ECF0F1',
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  scrollContent: {
    padding: hp(2),
    paddingBottom: hp(12),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionContainer: {
    width: wp(44),
    height: wp(44),
    marginBottom: hp(2),
    borderRadius: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sectionIcon: {
    marginBottom: hp(1),
  },
  sectionText: {
    fontSize: fs(2.2),
    color: '#2C3E50',
    fontWeight: '600',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(2),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#34495E',
    padding: hp(2),
    borderRadius: hp(1),
    marginHorizontal: wp(1),
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: fs(2),
    color: '#BDC3C7',
    marginLeft: wp(2),
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: hp(2),
  },
  socialButton: {
    padding: hp(1.5),
    marginHorizontal: wp(2),
    backgroundColor: '#34495E',
    borderRadius: hp(5),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp(2),
    paddingVertical: hp(1),
    borderTopWidth: 1,
    borderTopColor: '#3B536F',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp(1),
  },
  footerButtonText: {
    fontSize: fs(1.8),
    color: '#BDC3C7',
    marginLeft: wp(1),
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#2C3E50',
  },
  updateBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E67E22',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: hp(1.5),
  },
  updateText: {
    color: '#FFFFFF',
    fontSize: fs(1.8),
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(1),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(4),
  },
  updateButtonText: {
    color: '#E67E22',
    fontWeight: '700',
  },
});

export default Homescreen;