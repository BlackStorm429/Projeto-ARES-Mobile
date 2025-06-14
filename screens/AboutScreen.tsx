import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';

type AboutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'About'>;

export default function About() {
  const navigation = useNavigation<AboutScreenNavigationProp>();
  const { darkMode } = useTheme();
  const scheme = darkMode ? 'dark' : 'light';
  const themeColors = Colors[scheme];

  const colorScheme = darkMode ? "dark" : "light";
  const secondaryTextColor = darkMode ? '#ffffff' : '#20285D';

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1, 
      padding: 20,
      backgroundColor: Colors[colorScheme ?? "light"].background,
    },
    iconContainer: {
      padding: 8,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
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
    headerImage: { 
        width: 24, 
        height: 24 
    },
    logo: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginTop: 20,
      marginVertical: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      color: Colors[colorScheme ?? "light"].text,
      marginBottom: 10,
    },
    description: {
      textAlign: 'center',
      color: secondaryTextColor,
      marginBottom: 30,
    },
    subTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      paddingBottom: 8,
      color: '#ECAE55',
      marginBottom: 10,
      textShadowColor: '#000',    
      textShadowOffset: { width: -1, height:  1 },
      textShadowRadius: 1,
    },
    appName: {
      fontSize: 28,
      color: '#ECAE55',
      marginBottom: 30,
      textAlign: 'center',
      fontFamily: 'Boldatin-Bold',
      textShadowColor: '#000',    
      textShadowOffset: { width: -1, height:  1 },
      textShadowRadius: 1,
    },
    developerContainer: {
      marginBottom: 20,
    },
    developerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    devImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    devName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#EC4C7D',
    },
    devRole: {
      fontSize: 14,
      color: secondaryTextColor,
    },
  });

  return (
  <ScrollView contentContainerStyle={styles.container}>  
        {/* Cabeçalho com botões */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={[styles.iconContainer, { backgroundColor: themeColors.buttonBackground }]}>
                <Image source={require('../assets/images/back-icon.png')} style={styles.headerImage} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <View style={[styles.iconContainer, { backgroundColor: themeColors.buttonBackground }]}>
                <Image source={require('../assets/images/user-icon.png')} style={styles.headerImage} />
                </View>
            </TouchableOpacity>
        </View>

        {/* Logo e Título do Projeto */}
        <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.appName}>ARES</Text>
        <Text style={styles.description}>
            É um projeto realizado por estudantes do curso de Ciência da Computação da Pontifícia Universidade Católica de Minas Gerais (PUC-MG), na disciplina de Trabalho Interdisciplinar VI: Sistemas Paralelos e Distribuídos.
        </Text>

      {/* Desenvolvedores */}
      <Text style={styles.subTitle}>Desenvolvedores</Text>

      <View style={styles.developerContainer}>
        {/* Developer 1 */}
        <View style={styles.developerItem}>
          <Image source={require('../assets/images/carol.jpeg')} style={styles.devImage} />
          <View>
            <Text style={styles.devName}>Carolina Morais Nigri</Text>
            <Text style={styles.devRole}>Front-end & Back-end</Text>
          </View>
        </View>

        {/* Developer 2 */}
        <View style={styles.developerItem}>
          <Image source={require('../assets/images/jerson.jpeg')} style={styles.devImage} />
          <View>
            <Text style={styles.devName}>Jerson Vitor de Paula Gomes</Text>
            <Text style={styles.devRole}>Front-end & Back-end</Text>
          </View>
        </View>

        {/* Developer 3 */}
        <View style={styles.developerItem}>
          <Image source={require('../assets/images/lara.jpeg')} style={styles.devImage} />
          <View>
            <Text style={styles.devName}>Lara Brigida Rezende Souza</Text>
            <Text style={styles.devRole}>Front-end & Back-end</Text>
          </View>
        </View>

        {/* Developer 4 */}
        <View style={styles.developerItem}>
          <Image source={require('../assets/images/victor.jpeg')} style={styles.devImage} />
          <View>
            <Text style={styles.devName}>Victor Cabral de Souza Oliveira</Text>
            <Text style={styles.devRole}>Front-end & Back-end</Text>
          </View>
        </View>

        {/* Developer 5 */}
        <View style={styles.developerItem}>
          <Image source={require('../assets/images/wallace.jpeg')} style={styles.devImage} />
          <View>
            <Text style={styles.devName}>Wallace Freitas Oliveira</Text>
            <Text style={styles.devRole}>Front-end & Back-end</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
