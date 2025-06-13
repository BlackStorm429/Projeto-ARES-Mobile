import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import * as Font from 'expo-font';
import { ActivityIndicator, View } from 'react-native';

import MainScreen from './screens/MainScreen';
import SignInScreen from './screens/SignInScreen';
import AboutScreen from './screens/AboutScreen';
import CrosswordScreen from './screens/CrosswordScreen';
import WordSearchScreen from './screens/WordSearchScreen';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        'Boldatin-Bold': require('./assets/fonts/Boldatin-Bold.ttf'), 
      });
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Crossword" component={CrosswordScreen} />
        <Stack.Screen name="WordSearch" component={WordSearchScreen} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
