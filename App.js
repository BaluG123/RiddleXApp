// // App.js

// import React,{ useEffect,useState } from 'react';
// import { BackHandler, Alert } from 'react-native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Splashscreen from './src/screens/Splashscreen';
// import Homescreen from './src/screens/Homescreen';
// import Levelscreen from './src/screens/Levelscreen';
// import Questionscreen from './src/screens/Questionscreen';
// import SuccessScreen from './src/screens/SuccessScreen';
// import { NavigationContainer, useNavigation } from '@react-navigation/native';
// import messaging from '@react-native-firebase/messaging';

// const Stack = createNativeStackNavigator();

// const App = () => {
//   const navigation = useNavigation()
//   const [initialRoute, setInitialRoute] = useState('SplashScreen');

//   useEffect(()=>{
//     GetDevicetoken()
//   },[])

//   useEffect(() => {
//     // Assume a message-notification contains a "type" property in the data payload of the screen to open

//     messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log(
//         'Notification caused app to open from background state:',
//         remoteMessage.notification,
//       );
//       navigation.navigate(remoteMessage.data.type);
//     });

//     // Check whether an initial notification is available
//     messaging()
//       .getInitialNotification()
//       .then(remoteMessage => {
//         if (remoteMessage) {
//           console.log(
//             'Notification caused app to open from quit state:',
//             remoteMessage.notification.title,
//           );
//           setInitialRoute(remoteMessage.data.type);
//           console.log('type',remoteMessage.data.type)
//         }
//       });
//   }, [navigation]);

//   const GetDevicetoken = async ()=>{
//     const token = await messaging().getToken();
//     console.log('token',token)
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="SplashScreen" component={Splashscreen} />
//         <Stack.Screen name="HomeScreen" component={Homescreen} />
//         <Stack.Screen name="LevelScreen" component={Levelscreen} />
//         <Stack.Screen name="QuestionScreen" component={Questionscreen} />
//         <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;


// App.js

import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import Splashscreen from './src/screens/Splashscreen';
import Homescreen from './src/screens/Homescreen';
import Levelscreen from './src/screens/Levelscreen';
import Questionscreen from './src/screens/Questionscreen';
import SuccessScreen from './src/screens/SuccessScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import subscribeToTopics from './src/util/notification';
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

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState('SplashScreen');

  useEffect(() => {
    requestUserPermission(); 
    GetDevicetoken();
    subscribeToTopics(['levels']);
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification);
      setInitialRoute(remoteMessage.data.type);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage.notification.title);
          setInitialRoute(remoteMessage.data.type);
          console.log('type', remoteMessage.data.type);
        }
      });

    return unsubscribe; // Cleanup the subscription on component unmount
  }, []); // No need to include navigation in the dependency array

  const GetDevicetoken = async () => {
    const token = await messaging().getToken();
    console.log('token', token);
  };

  
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

async function subscribeToTopic(topic) {
  try {
    await messaging().subscribeToTopic(topic);
    console.log(`Subscribed to topic: ${topic}`);
  } catch (error) {
    console.error(`Error subscribing to topic ${topic}:`, error);
  }
}
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={Splashscreen} />
        <Stack.Screen name="LevelScreen" component={Levelscreen} />
        <Stack.Screen name="HomeScreen" component={Homescreen} />
        <Stack.Screen name="QuestionScreen" component={Questionscreen} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <Stack.Screen name="TimeChallengeScreen" component={TimeChallengeScreen} />
        <Stack.Screen name="StatisticsScreen" component={StatisticsScreen} />
        <Stack.Screen name="MixedScreen" component={MixedScreen} />
        <Stack.Screen name="AdditionScreen" component={AdditionScreen} />
        <Stack.Screen name="SubtractionScreen" component={SubtractionScreen}/>
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
