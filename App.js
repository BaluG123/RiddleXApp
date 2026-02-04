import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { MobileAds } from 'react-native-google-mobile-ads';
import adManager from './src/util/adManager';
import Splashscreen from './src/screens/Splashscreen';
import Homescreen from './src/screens/Homescreen';
import Levelscreen from './src/screens/Levelscreen';
import Questionscreen from './src/screens/Questionscreen';
import SuccessScreen from './src/screens/SuccessScreen';
import TimeChallengeScreen from './src/screens/TimeChallengeScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import MixedScreen from './src/screens/MixedScreen';
import AdditionScreen from './src/screens/AdditionScreen';
import SubtractionScreen from './src/screens/SubtractionScreen';
import MultiplicationScreen from './src/screens/MultiplicationScreen';
import DivisionScreen from './src/screens/DivisionScreen';
import GeometryScreen from './src/screens/GeometryScreen';
import FractionScreen from './src/screens/FractionScreen';
import ExponentScreen from './src/screens/ExponentScreen';
import WordProblemsScreen from './src/screens/WordProblemsScreen';
import LogicPuzzleScreen from './src/screens/LogicPuzzlesScreen';
import MeasurementScreen from './src/screens/MeasurementScreen';
import AlgebraScreen from './src/screens/AlgebraScreen';
import NumberPatternsScreen from './src/screens/NumberPatternsScreen';
import MoneyMathScreen from './src/screens/MoneyMathScreen';
import EquationsScreen from './src/screens/EquationsScreen';
import ProbabilityScreen from './src/screens/ProbabilityScreen';
import RootsScreen from './src/screens/RootsScreen';

const Stack = createStackNavigator();

const App = () => {
  const [adsInitialized, setAdsInitialized] = useState(false);

  useEffect(() => {
    const initializeAds = async () => {
      try {
        await MobileAds().initialize();
        console.log('Google Mobile Ads initialized');
        
        adManager.initializeAds();
        setAdsInitialized(true);
        
        setTimeout(() => {
          adManager.showAppOpenAd().then(shown => {
            console.log('App open ad shown:', shown);
          });
        }, 2000);
      } catch (error) {
        console.warn('Error initializing ads:', error);
        setAdsInitialized(true);
      }
    };

    initializeAds();

    return () => {
      adManager.cleanup();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={Splashscreen} />
        <Stack.Screen name="HomeScreen" component={Homescreen} />
        <Stack.Screen name="LevelScreen" component={Levelscreen} />
        <Stack.Screen name="QuestionScreen" component={Questionscreen} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <Stack.Screen name="TimeChallengeScreen" component={TimeChallengeScreen} />
        <Stack.Screen name="StatisticsScreen" component={StatisticsScreen} />
        <Stack.Screen name="MixedScreen" component={MixedScreen} />
        <Stack.Screen name="AdditionScreen" component={AdditionScreen} />
        <Stack.Screen name="SubtractionScreen" component={SubtractionScreen} />
        <Stack.Screen name="MultiplicationScreen" component={MultiplicationScreen} />
        <Stack.Screen name="DivisionScreen" component={DivisionScreen} />
        <Stack.Screen name="GeometryScreen" component={GeometryScreen} />
        <Stack.Screen name="FractionScreen" component={FractionScreen} />
        <Stack.Screen name="ExponentScreen" component={ExponentScreen} />
        <Stack.Screen name="WordProblemsScreen" component={WordProblemsScreen} />
        <Stack.Screen name="LogicPuzzleScreen" component={LogicPuzzleScreen} />
        <Stack.Screen name="MeasurementScreen" component={MeasurementScreen} />
        <Stack.Screen name="AlgebraScreen" component={AlgebraScreen} />
        <Stack.Screen name="NumberPatternsScreen" component={NumberPatternsScreen} />
        <Stack.Screen name="MoneyMathScreen" component={MoneyMathScreen} />
        <Stack.Screen name="EquationsScreen" component={EquationsScreen} />
        <Stack.Screen name="ProbabilityScreen" component={ProbabilityScreen} />
        <Stack.Screen name="RootsScreen" component={RootsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
