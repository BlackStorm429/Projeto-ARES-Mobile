import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/Colors';

const backIcon = require('../assets/images/back-icon.png');
const userIcon = require('../assets/images/user-icon.png');

type NavProp = StackNavigationProp<RootStackParamList, 'Notifications'>;

export default function NotificationsScreen() {
  const navigation = useNavigation<NavProp>();
  const { darkMode, setDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const scheme = darkMode ? 'dark' : 'light';
  const themeColors = Colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }] }>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.iconContainer}>
            <Image source={backIcon} style={styles.headerImage} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <View style={styles.iconContainer}>
            <Image source={userIcon} style={styles.headerImage} />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: themeColors.text, textShadowColor: '#000', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 1 }]}>Notificações</Text>
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: 'red' }]}>Receber notificações</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#2a3a5c' : '#f4f3f4'}
        />
      </View>
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: 'red' }]}>Modo escuro</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
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
    paddingTop: 10,
    paddingHorizontal: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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