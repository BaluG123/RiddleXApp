// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splashscreen from './src/screens/Splashscreen';
import Homescreen from './src/screens/Homescreen';
import Levelscreen from './src/screens/Levelscreen';
import Questionscreen from './src/screens/Questionscreen';
import SuccessScreen from './src/screens/SuccessScreen';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={Splashscreen} />
        <Stack.Screen name="HomeScreen" component={Homescreen} />
        <Stack.Screen name="LevelScreen" component={Levelscreen} />
        <Stack.Screen name="QuestionScreen" component={Questionscreen} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
