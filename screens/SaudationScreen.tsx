import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/Colors';

// Ícones
const backIcon = require('../assets/images/back-icon.png');
const userIcon = require('../assets/images/user-icon.png');

type NavProp = StackNavigationProp<RootStackParamList, 'Saudation'>;

export default function SaudationScreen() {
  const navigation = useNavigation<NavProp>();
  const { darkMode } = useTheme();
  const scheme = darkMode ? 'dark' : 'light';
  const themeColors = Colors[scheme];

  const [modalVisible, setModalVisible] = useState<'alphabet' | 'numerals' | null>(null);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }] }>
      {/* Cabeçalho com botões */}
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
      <Text style={[styles.title, { color: '#ECAE55', textShadowColor: '#000', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 1 }]}>Saudações</Text>
      <Text style={[styles.text, { color: themeColors.textSecondary }]}>Que bom que você decidiu aprender um pouco sobre libras. Nos módulos você encontrará diversos vídeos para te ajudar. Aqui temos o alfabeto e os número de 1 a 10 para te ajudar sempre que precisar.</Text>
      <View style={styles.popupsContainer}>
        <TouchableOpacity style={styles.popupBox} onPress={() => setModalVisible('alphabet')}>
          <Text style={[styles.popupText, { color: '#ECAE55' }]}>Alfabeto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.popupBox} onPress={() => setModalVisible('numerals')}>
          <Text style={[styles.popupText, { color: '#ECAE55' }]}>Numerais</Text>
        </TouchableOpacity>
      </View>
      {/* Modal Alfabeto */}
      <Modal
        visible={modalVisible === 'alphabet'}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image source={require('../assets/images/alphabet.png')} style={styles.modalImage} resizeMode="contain" />
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(null)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Modal Numerais */}
      <Modal
        visible={modalVisible === 'numerals'}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image source={require('../assets/images/numerals.png')} style={styles.modalImage} resizeMode="contain" />
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(null)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
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
  text: { fontSize: 18, marginTop: 12, textAlign: 'center' },
  popupsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 16,
  },
  popupBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 32,
    marginHorizontal: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#ECAE55',
  },
  popupText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a3a5c',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    maxWidth: '90%',
    maxHeight: '80%',
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 16,
    borderRadius: 12,
  },
  closeButton: {
    backgroundColor: '#ECAE55',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: '#2a3a5c',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 