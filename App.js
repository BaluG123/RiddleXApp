/**
 * App.js — Math Master v3.0
 * Main Entry Point with Navigation and Context
 */
import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Context
import { GameProvider } from './src/context/GameContext';

// Screens
import Splashscreen from './src/screens/Splashscreen';
import HomeTab from './src/screens/HomeTab';
import PlayTab from './src/screens/PlayTab';
import ProfileTab from './src/screens/ProfileTab';
import DailyChallengeScreen from './src/screens/DailyChallengeScreen';
import MathChallengeScreen from './src/screens/MathChallengeScreen';
import Questionscreen from './src/screens/Questionscreen';
import Levelscreen from './src/screens/Levelscreen';
import SuccessScreen from './src/screens/SuccessScreen';
import TimeChallengeScreen from './src/screens/TimeChallengeScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

// Theme
import { Colors } from './src/theme/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Play') iconName = 'videogame-asset';
          else if (route.name === 'Daily') iconName = 'event-available';
          else if (route.name === 'Profile') iconName = 'person';
          
          return <Icon name={iconName} size={hp(3)} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.glassBorder,
          height: hp(8),
          paddingBottom: hp(1.5),
          paddingTop: hp(1),
          position: 'absolute',
          borderTopLeftRadius: hp(3),
          borderTopRightRadius: hp(3),
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: hp(1.4),
          fontWeight: '600'
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeTab} options={{ title: 'Home' }} />
      <Tab.Screen name="Play" component={PlayTab} options={{ title: 'Play' }} />
      <Tab.Screen name="Daily" component={DailyChallengeScreen} options={{ title: 'Daily' }} />
      <Tab.Screen name="Profile" component={ProfileTab} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <GameProvider>
      <NavigationContainer>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <Stack.Navigator 
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyle: { backgroundColor: '#0f0c29' }
          }}
        >
          <Stack.Screen name="Splash" component={Splashscreen} />
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="MathChallengeScreen" component={MathChallengeScreen} />
          <Stack.Screen name="Questionscreen" component={Questionscreen} />
          <Stack.Screen name="LevelScreen" component={Levelscreen} />
          <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
          <Stack.Screen name="TimeChallengeScreen" component={TimeChallengeScreen} />
          <Stack.Screen name="StatisticsScreen" component={StatisticsScreen} />
          <Stack.Screen name="DailyChallengeScreen" component={DailyChallengeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
};

export default App;
