import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import * as Font from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

import MainScreen from './screens/MainScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import AboutScreen from './screens/AboutScreen';
import CrosswordScreen from './screens/CrosswordScreen';
import WordSearchScreen from './screens/WordSearchScreen';
import VideoRecorderScreen from './screens/VideoRecorderScreen';
import FamilyScreen from './screens/FamilyScreen';
import FamilyModuleScreen from './screens/FamilyModuleScreen';
import FriendsScreen from './screens/FriendsScreen';
import FriendsModuleScreen from './screens/FriendsModuleScreen';
import AnimalsScreen from './screens/AnimalsScreen';
import AnimalsModuleScreen from './screens/AnimalsModuleScreen';
import FruitsScreen from './screens/FruitsScreen';
import FruitsModuleScreen from './screens/FruitsModuleScreen';
import SaudationScreen from './screens/SaudationScreen';
import NotificationsScreen from './screens/NotificationsScreen';

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
    <ThemeProvider>
      <NotificationProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Crossword" component={CrosswordScreen} />
            <Stack.Screen name="WordSearch" component={WordSearchScreen} />
            <Stack.Screen name="VideoRecorder" component={VideoRecorderScreen} />
            <Stack.Screen name="Family" component={FamilyScreen} />
            <Stack.Screen name="FamilyModule" component={FamilyModuleScreen} />
            <Stack.Screen name="Friends" component={FriendsScreen} />
            <Stack.Screen name="FriendsModule" component={FriendsModuleScreen} />
            <Stack.Screen name="Animals" component={AnimalsScreen} />
            <Stack.Screen name="AnimalsModule" component={AnimalsModuleScreen} />
            <Stack.Screen name="Fruits" component={FruitsScreen} />
            <Stack.Screen name="FruitsModule" component={FruitsModuleScreen} />
            <Stack.Screen name="Saudation" component={SaudationScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </Stack.Navigator>
          <Toast />
        </NavigationContainer>
      </NotificationProvider>
    </ThemeProvider>
  );
}
