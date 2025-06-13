import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { WebView } from 'react-native-webview';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

type NavProp = StackNavigationProp<RootStackParamList, 'AnimalsModule'>;

export default function AnimalsModuleScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'AnimalsModule'>>();
  const navigation = useNavigation<NavProp>();
  const { moduleNumber } = route.params;
  const { darkMode } = useTheme();
  const scheme = darkMode ? 'dark' : 'light';
  const themeColors = Colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }] }>
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
      <Text style={[styles.title, { color: themeColors.text, textShadowColor: '#000', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 1, marginTop: 24 }]}>Módulo {moduleNumber}</Text>
      {moduleNumber === 1 ? (
        <WebView
          style={styles.video}
          javaScriptEnabled
          domStorageEnabled
          source={{ uri: 'https://www.youtube.com/watch?v=MIT0-9DNgi0' }}
        />
      ) : (
        <Text style={[styles.text, { color: themeColors.textSecondary }]}>
          Conteúdo do módulo {moduleNumber} em breve!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  header: {
    width: '100%',
    paddingTop: 0,
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  video: { width: width - 32, height: (width - 32) * 0.56, borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
  text: { fontSize: 18, color: '#333', textAlign: 'center' },
}); 