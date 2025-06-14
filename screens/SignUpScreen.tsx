import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import axios from 'axios';
import { Colors } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUp() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { darkMode } = useTheme();

  const handleSignUp = async () => {
    try {
      if (email !== confirmEmail) {
        Toast.show({
          type: 'error',
          text1: 'Os e-mails não coincidem',
          visibilityTime: 2000,
          position: 'top',
        });
        return;
      }

      if (password !== confirmPassword) {
        Toast.show({
          type: 'error',
          text1: 'As senhas não coincidem',
          visibilityTime: 2000,
          position: 'top',
        });
        return;
      }

      const response = await axios.post(null + '/register', {
        name,
        email,
        password,
      });

      console.log('Usuário cadastrado com sucesso:', response.data);
      
      Toast.show({
        type: 'success',
        text1: 'Cadastro realizado com sucesso!',
        visibilityTime: 2000,
        position: 'top',
      });

      navigation.navigate('SignIn');

    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao realizar cadastro',
        visibilityTime: 2000,
        position: 'top',
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
      textShadowColor: '#000',
      textShadowOffset: { width: -1, height: 1 },
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
    signupButton: {
      width: '80%',
      padding: 15,
      backgroundColor: Colors[colorScheme ?? "light"].buttonBackground,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    signupText: {
      color: '#ECAE55',
      fontSize: 16,
      fontWeight: 'bold',
    },
    loginText: {
      color: 'red',
    },
  });

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.appName}>ARES</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Nome" 
        placeholderTextColor={Colors[colorScheme ?? "light"].text} 
        value={name} 
        onChangeText={setName} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="E-mail" 
        placeholderTextColor={Colors[colorScheme ?? "light"].text} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Confirmar E-mail" 
        placeholderTextColor={Colors[colorScheme ?? "light"].text} 
        value={confirmEmail} 
        onChangeText={setConfirmEmail} 
        keyboardType="email-address" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Senha" 
        placeholderTextColor={Colors[colorScheme ?? "light"].text} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Confirmar Senha" 
        placeholderTextColor={Colors[colorScheme ?? "light"].text} 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
        secureTextEntry 
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.loginText}>Já possui conta? Faça login</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
} 