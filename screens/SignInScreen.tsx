import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import axios from 'axios';
import { Colors } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignIn() {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { darkMode } = useTheme();

  const handleSignIn = async () => {
    try {
      const response = await axios.post(null + '/login', {
        email,
        password,
      });
      
      console.log('Usuário logado com sucesso:', response.data);
      
      // Armazena o email do usuário no AsyncStorage
      const userEmail = response.data.user.email; 
      await AsyncStorage.setItem('userEmail', userEmail);
      
      navigation.navigate('Main');

    } catch (error) {
      console.error('Erro ao logar o usuário:', error);
      Toast.show({
        type: 'error',
        text1: 'Credenciais inválidas',
        visibilityTime: 2000,
        position: 'top',
        autoHide: true,
        topOffset: 30,
      });
    }
  };

  const colorScheme = darkMode ? "dark" : "light";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[colorScheme ?? "light"].background,
      paddingHorizontal: 20,
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 20,
    },
    appName: {
      fontSize: 28,
      color: '#ECAE55',
      marginBottom: 30,
      fontFamily: 'Boldatin-Bold',
      textShadowColor: '#000',     // cor do contorno
      textShadowOffset: { width: -1, height:  1 },
      textShadowRadius: 1,
    },
    input: {
      width: '80%',
      padding: 10,
      backgroundColor: Colors[colorScheme ?? "light"].inputBackground,
      borderRadius: 10,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 15,
      color: Colors[colorScheme ?? "light"].text,
    },
    loginButton: {
      width: '80%',
      padding: 15,
      backgroundColor: Colors[colorScheme ?? "light"].buttonBackground,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    loginText: {
      color: '#ECAE55',
      fontSize: 16,
      fontWeight: 'bold',
    },
    forgotPasswordText: {
      color: Colors[colorScheme ?? "light"].text,
      marginBottom: 30,
    },
    signupText: {
      color: 'red',
    },
  });

  useFocusEffect(
    useCallback(() => {
      // Limpa os campos sempre que a tela for focada
      setEmail('');
      setPassword('');
    }, [])
  );

  const handleSignInToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Verificando credenciais...',
      text2: 'Por favor aguarde',
      position: 'top',
      visibilityTime: 5000,
      autoHide: true,
      topOffset: 30,
      onShow: async () => {
        await handleSignIn();
      }
    });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.appName}>ARES</Text>
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={Colors[colorScheme ?? "light"].text} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={Colors[colorScheme ?? "light"].text} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.loginButton} onPress={handleSignInToast}>
        <Text style={styles.loginText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupText}>Ainda não possui cadastro? Cadastre-se</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
}