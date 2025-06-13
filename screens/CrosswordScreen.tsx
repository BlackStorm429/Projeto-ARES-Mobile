// screens/CrosswordScreen.tsx

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface WordInfo {
  name: string;
  positions: { row: number; col: number }[];
  image: any; // caminho da imagem do sinal LIBRAS
  circle: [number, number];
  arrow: 'arrow-forward' | 'arrow-down' | 'arrow-back' | 'arrow-up';
}

type CrosswordNavProp = StackNavigationProp<RootStackParamList, 'Crossword'>;

// Definição das palavras e suas posições (horizontal/vertical)
const WORDS: WordInfo[] = [
  // TELEFONE horizontal
  {
    name: 'TELEFONE',
    positions: [
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 1, col: 4 },
      { row: 1, col: 5 },
      { row: 1, col: 6 },
      { row: 1, col: 7 },
      { row: 1, col: 8 },
      { row: 1, col: 9 },
    ],
    image: require('../assets/images/phone.png'),
    circle: [1, 10],
    arrow: 'arrow-back',
  },
  // FOME vertical
  {
    name: 'FOME',
    positions: [
      { row: 1, col: 5 },
      { row: 2, col: 5 },
      { row: 3, col: 5 },
      { row: 4, col: 5 },
    ],
    image: require('../assets/images/hungry.png'),
    circle: [0, 5],
    arrow: 'arrow-down',
  },
  // COMER horizontal
  {
    name: 'COMER',
    positions: [
      { row: 4, col: 2 },
      { row: 4, col: 3 },
      { row: 4, col: 4 },
      { row: 4, col: 5 },
      { row: 4, col: 6 },
    ],
    image: require('../assets/images/eat.png'),
    circle: [3, 1],
    arrow: 'arrow-forward',
  },
  // RUA vertical
  {
    name: 'RUA',
    positions: [
      { row: 4, col: 6 },
      { row: 5, col: 6 },
      { row: 6, col: 6 },
    ],
    image: require('../assets/images/street.png'),
    circle: [3, 1],
    arrow: 'arrow-forward',
  },
  // ÁGUA horizontal
  {
    name: 'ÁGUA',
    positions: [
      { row: 6, col: 6 },
      { row: 6, col: 7 },
      { row: 6, col: 8 },
      { row: 6, col: 9 },
    ],
    image: require('../assets/images/water.png'),
    circle: [5, 3],
    arrow: 'arrow-forward',
  },
  // AMIGO vertical
  {
    name: 'AMIGO',
    positions: [
      { row: 6, col: 9 },
      { row: 7, col: 9 },
      { row: 8, col: 9 },
      { row: 9, col: 9 },
      { row: 10, col: 9 },
    ],
    image: require('../assets/images/friend.png'),
    circle: [3, 1],
    arrow: 'arrow-forward',
  },
  // LICENÇA horizontal
  {
    name: 'LICENÇA',
    positions: [
      { row: 8, col: 8 },
      { row: 8, col: 9 },
      { row: 8, col: 10 },
      { row: 8, col: 11 },
      { row: 8, col: 12 },
      { row: 8, col: 13 },
      { row: 8, col: 14 },
    ],
    image: require('../assets/images/excuse-me.png'),
    circle: [7, 3],
    arrow: 'arrow-forward',
  },
  // TRABALHO horizontal
  {
    name: 'TRABALHO',
    positions: [
      { row: 10, col: 2 },
      { row: 10, col: 3 },
      { row: 10, col: 4 },
      { row: 10, col: 5 },
      { row: 10, col: 6 },
      { row: 10, col: 7 },
      { row: 10, col: 8 },
      { row: 10, col: 9 },
    ],
    image: require('../assets/images/work.png'),
    circle: [9, 1],
    arrow: 'arrow-forward',
  },
];

const NUM_ROWS = 11;
const NUM_COLS = 16;
const margin = 4;
const screenWidth = Dimensions.get('window').width;
const totalMarginX = margin * (NUM_COLS + 1);
const cellSize = (screenWidth - totalMarginX) / NUM_COLS;

// Gera um mapa de células ativas e quais letras pertencem a cada célula
function generateGridMap() {
  const map: { [key: string]: { letters: string[] } } = {};
  for (const word of WORDS) {
    for (let i = 0; i < word.positions.length; i++) {
      const key = `${word.positions[i].row}-${word.positions[i].col}`;
      if (!map[key]) map[key] = { letters: [] };
      map[key].letters.push(word.name[i]);
    }
  }
  return map;
}

const gridMap = generateGridMap();

export default function CrosswordScreen() {
  const navigation = useNavigation<CrosswordNavProp>();
  const { darkMode } = useTheme();
  const scheme = darkMode ? 'dark' : 'light';
  const themeColors = Colors[scheme];

  // Estado para cada letra inserida pelo usuário em cada "caixa" do crucigrama
  const [grid, setGrid] = useState<{ [key: string]: string }>({});
  // Estado para controlar quais palavras do Word Bank já foram riscadas
  const [struckWords, setStruckWords] = useState<Set<string>>(new Set());

  // Renderiza as células do tabuleiro
  const renderCells = () => {
    const cells: React.ReactNode[] = [];
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        const key = `${row}-${col}`;
        if (!gridMap[key]) continue;
        const letter = grid[key] || '';
        const top = margin + row * (cellSize + margin);
        const left = margin + col * (cellSize + margin);
        cells.push(
          <View
            key={key}
            style={[
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                top,
                left,
              },
            ]}
          >
            <TextInput
              style={styles.input}
              maxLength={1}
              value={letter}
              onChangeText={(txt) => {
                setGrid((prev) => ({ ...prev, [key]: txt.toUpperCase() }));
              }}
              placeholder=""
              placeholderTextColor="#bbb"
            />
          </View>
        );
      }
    }
    return cells;
  };

  // Altera o estado "riscado" no Word Bank
  const toggleStruckWord = (word: string) => {
    setStruckWords((prev) => {
      const next = new Set(prev);
      next.has(word) ? next.delete(word) : next.add(word);
      return next;
    });
  };

  // Renderiza os círculos com imagens e setas
  const renderImagesAndArrows = () => {
    return WORDS.map((w, idx) => {
      const [row, col] = w.circle;
      const imgSize = cellSize * 1.2;
      const top = margin + row * (cellSize + margin) + (cellSize - imgSize) / 2;
      const left = margin + col * (cellSize + margin) + (cellSize - imgSize) / 2;
      let arrowTop = top + imgSize / 2;
      let arrowLeft = left + imgSize;
      if (w.arrow === 'arrow-down') {
        arrowTop = top + imgSize;
        arrowLeft = left + imgSize / 2 - cellSize * 0.35;
      }
      return (
        <React.Fragment key={`img-arrow-${idx}`}>
          <Image
            source={w.image}
            style={{
              width: imgSize,
              height: imgSize,
              resizeMode: 'contain',
              position: 'absolute',
              top,
              left,
              zIndex: 10,
            }}
          />
          <Ionicons
            name={w.arrow}
            size={cellSize * 0.7}
            color="#000"
            style={{
              position: 'absolute',
              top: arrowTop,
              left: arrowLeft,
              zIndex: 10,
            }}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      {/* ===== CABEÇALHO (back + menu) ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: themeColors.buttonBackground },
            ]}
          >
            <Image
              source={require('../assets/images/back-icon.png')}
              style={styles.headerImage}
            />
          </View>
        </TouchableOpacity>

        {/* Espaço vazio para manter os ícones nas extremidades */}
        <View style={{ width: 24 }} />

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: themeColors.buttonBackground },
            ]}
          >
            <Image
              source={require('../assets/images/menu-icon.png')}
              style={styles.headerImage}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* ===== TÍTULO "Palavra-Cruzada" ===== */}
      <Text
        style={[
          styles.title,
          { color: themeColors.text, marginBottom: 32 /* mais espaço antes do grid */ },
        ]}
      >
        Palavra-Cruzada
      </Text>

      {/* ===== TABULEIRO (crossword) ===== */}
      <View
        style={[
          styles.boardContainer,
          {
            width: NUM_COLS * (cellSize + margin) + margin,
            height: NUM_ROWS * (cellSize + margin) + margin,
          },
        ]}
      >
        {renderCells()}
        {renderImagesAndArrows()}
      </View>

      {/* ===== WORD BANK (caixa de palavras) logo abaixo ===== */}
      <View style={styles.wordBankContainer}>
        {WORDS.map((w, idx) => {
          const isStruck = struckWords.has(w.name);
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => toggleStruckWord(w.name)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.wordBox,
                  {
                    backgroundColor: isStruck
                      ? 'transparent'
                      : themeColors.buttonBackground,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.wordBoxText,
                    {
                      color: isStruck ? '#999' : themeColors.text,
                      textDecorationLine: isStruck ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {w.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ===== Estilos =====
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  // Header com botões de "voltar" e "menu"
  header: {
    width: '100%',
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: 24,
    height: 24,
  },
  // Título grande "Palavra-Cruzada"
  title: {
    fontSize: 24,
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  // Container do "tabuleiro" em si (posição: absoluta para cada célula)
  boardContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  // Cada "caixa" do crucigrama
  cell: {
    position: 'absolute',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 18,
    padding: 0,
  },
  // Word Bank (as palavras abaixo, cada uma dentro de um quadrado que o usuário pode riscar)
  wordBankContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 40,
  },
  wordBox: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#666',
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 6,
    marginVertical: 10,
  },
  wordBoxText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
