import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/Colors';
import { useNotification } from '../contexts/NotificationContext';

const backIcon = require('../assets/images/back-icon.png');
const userIcon = require('../assets/images/user-icon.png');

type NavProp = StackNavigationProp<RootStackParamList, 'Notifications'>;

export default function NotificationsScreen() {
  const navigation = useNavigation<NavProp>();
  const { darkMode, toggleDarkMode } = useTheme();
  const { notification, toggleNotification } = useNotification();
  const scheme = darkMode ? 'dark' : 'light';
  const themeColors = Colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }] }>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.buttonBackground }]}>
            <Image source={backIcon} style={styles.headerImage} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.buttonBackground }]}>
            <Image source={userIcon} style={styles.headerImage} />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: '#ECAE55', textShadowColor: '#000', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 1 }]}>Notificações</Text>
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: 'red' }]}>Receber notificações</Text>
        <Switch
          value={notification}
          onValueChange={toggleNotification}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notification ? '#2a3a5c' : '#f4f3f4'}
        />
      </View>
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: 'red' }]}>Modo escuro</Text>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkMode ? '#2a3a5c' : '#f4f3f4'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24 },
  header: {
    width: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    elevation: 100,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: { width: 24, height: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32 },
  settingRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  settingLabel: { fontSize: 18 },
}); 