import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';
import Toast from 'react-native-toast-message';

// ícones estáticos
const menuIcon = require('../assets/images/menu-icon.png');
const backIcon = require('../assets/images/back-icon.png');
const userIcon = require('../assets/images/user-icon.png');

const { width } = Dimensions.get('window');

type MainNavProp = StackNavigationProp<RootStackParamList, 'Main'>;

const getNext7Days = () => {
  const today = new Date();
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      label: String(date.getDate()).padStart(2, '0'),
      day: daysOfWeek[date.getDay()],
    };
  });
};

const days = getNext7Days();

const games = [
  { title: 'Palavras Cruzadas', icon: require('../assets/images/crossword.png') },
  { title: 'Caça Palavras',     icon: require('../assets/images/word-search.png') },
];

const modules = [
  { title: 'Familia',  icon: require('../assets/images/family.png') },
  { title: 'Amigos',   icon: require('../assets/images/friends.png') },
  { title: 'Animais',  icon: require('../assets/images/animals.png') },
  { title: 'Frutas',   icon: require('../assets/images/fruits.png') },
];

export default function Main() {
  const navigation = useNavigation<MainNavProp>();
  const { darkMode } = useTheme();
  const scheme = darkMode ? 'dark' : 'light';
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(v => !v);

  return (
    <View style={[styles.container, { backgroundColor: Colors[scheme].background }]}>
      {/* HEADER sempre por cima */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <View style={[styles.iconContainer, { backgroundColor: Colors[scheme].buttonBackground }]}>
            <Image source={menuVisible ? backIcon : menuIcon} style={styles.headerImage} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <View style={[styles.iconContainer, { backgroundColor: Colors[scheme].buttonBackground }]}>
            <Image source={userIcon} style={styles.headerImage} />
          </View>
        </TouchableOpacity>
      </View>

      {/* MENU lateral cobrindo toda a tela */}
      {menuVisible && (
        <View style={[styles.menuOverlay, { backgroundColor: Colors[scheme].buttonBackground }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Settings');
            }}
          >
            <Text style={[styles.menuText, { color: Colors[scheme].text }]}>Configurações</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('About');
            }}
          >
            <Text style={[styles.menuText, { color: Colors[scheme].text }]}>Sobre</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={!menuVisible}>
        {/* Calendário */}
        <View style={styles.calendarContainer}>
          {days.map((item, i) => {
            const isToday = i === 0;
            return (
              <View key={i} style={styles.dayItem}>
                <View
                  style={[
                    styles.dayCircle,
                    { backgroundColor: isToday ? '#ECAE55' : Colors[scheme].inputBackground },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      { color: isToday ? '#001F3F' : Colors[scheme].text },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
                <Text style={[styles.dayText, { color: Colors[scheme].text }]}>{item.day}</Text>
              </View>
            );
          })}
        </View>

        {/* Card de Unidade */}
        <View style={[styles.cardContainer, { backgroundColor: Colors[scheme].buttonBackground }]}>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardSubtitle, { color: Colors[scheme].textSecondary }]}>
              Unidade atual
            </Text>
            <Text style={[styles.cardTitle, { color: Colors[scheme].text }]}>Saudações</Text>
          </View>
          <View style={styles.cardImageWrapper}>
            <Image
              source={require('../assets/images/saudation.png')}
              style={styles.saudationImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Seção Jogos */}
        <Text style={[styles.sectionTitle, { color: Colors[scheme].text }]}>Jogos</Text>
        <View style={styles.gamesWrapper}>
          {games.map(g => {
            const screen = g.title === 'Palavras Cruzadas' ? 'Crossword' : 'WordSearch';
            return (
              <TouchableOpacity
                key={g.title}
                onPress={() => navigation.navigate(screen)}
                style={[styles.itemCard, { backgroundColor: Colors[scheme].buttonBackground }]}
              >
                <Image source={g.icon} style={styles.itemIcon} resizeMode="contain" />
                <Text style={[styles.itemTitle, { color: Colors[scheme].text }]}>{g.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Seção Módulos */}
        <View style={styles.modulesHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[scheme].text }]}>Módulos</Text>
        </View>
        <View style={styles.modulesWrapper}>
          {modules.map(m => (
            <TouchableOpacity
              key={m.title}
              style={[styles.moduleCard, { backgroundColor: Colors[scheme].buttonBackground }]}
            >
              <Image source={m.icon} style={styles.moduleIcon} resizeMode="contain" />
              <Text style={[styles.moduleTitle, { color: Colors[scheme].text }]}>{m.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },

  header: {
    width: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,           // alto para ficar acima do menu
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

  menuOverlay: {
    position: 'absolute',
    top: 0,                // agora começa do topo
    bottom: 0,
    left: 0,
    width: width * 0.5,
    paddingTop: 80,
    paddingHorizontal: 20,
    zIndex: 10,
    elevation: 10,
    justifyContent: 'center',
  },
  menuItem: {
    backgroundColor: '#ffffff22',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
  },

  scrollContent: { paddingBottom: 40 },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  dayItem: { alignItems: 'center' },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayLabel: { fontSize: 14, fontWeight: '600' },
  dayText: { fontSize: 12 },

  cardContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    margin: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTextContainer: { flex: 1 },
  cardSubtitle: { fontSize: 12, marginBottom: 4 },
  cardTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  cardImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
  },
  saudationImage: { width: 100, height: 100 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginTop: 24,
    textShadowColor: '#000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },

  gamesWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingVertical: 12,
  },
  itemCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIcon: { width: 60, height: 60, marginBottom: 8 },
  itemTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center' },

  modulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  modulesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 12,
  },
  moduleCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIcon: { width: 70, height: 70, marginBottom: 8 },
  moduleTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
