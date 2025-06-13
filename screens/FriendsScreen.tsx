import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/Colors';

const modules = [1, 2, 3, 4, 5];

type NavProp = StackNavigationProp<RootStackParamList, 'Friends'>;

export default function FriendsScreen() {
  const navigation = useNavigation<NavProp>();
  const { darkMode } = useTheme();
  const scheme = darkMode ? 'dark' : 'light';
  const themeColors = Colors[scheme];
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }] }>
      {/* Cabeçalho com botões */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.iconContainer}>
            <Image source={require('../assets/images/back-icon.png')} style={styles.headerImage} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <View style={styles.iconContainer}>
            <Image source={require('../assets/images/user-icon.png')} style={styles.headerImage} />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: themeColors.text, textShadowColor: '#000', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 1 }]}>Amigos - Módulos</Text>
      {modules.map((num) => (
        <TouchableOpacity
          key={num}
          style={[styles.moduleButton, { backgroundColor: themeColors.buttonBackground }]}
          onPress={() => navigation.navigate('FriendsModule', { moduleNumber: num })}
        >
          <Text style={[styles.moduleText, { color: themeColors.text } ]}>Módulo {num}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: {
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: { width: 24, height: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32 },
  moduleButton: {
    backgroundColor: '#2a3a5c',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 12,
    width: 220,
    alignItems: 'center',
  },
  moduleText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
