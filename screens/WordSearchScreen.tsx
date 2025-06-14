// screens/WordSearchScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

type WordSearchNavProp = StackNavigationProp<RootStackParamList, 'WordSearch'>;

// Alterado para 8×8
const NUM_ROWS = 8;
const NUM_COLS = 8;

const WORDS = ['GATO', 'CACHORRO', 'PASSARO', 'PEIXE'];

// Atualizado conforme coordenadas:
// B2→"1-1", C2→"1-2", D2→"1-3", E2→"1-4"
//
// G1→"0-6", G2→"1-6", G3→"2-6", G4→"3-6", G5→"4-6", G6→"5-6", G7→"6-6", G8→"7-6"
//
// H1→"0-7", H2→"1-7", H3→"2-7", H4→"3-7", H5→"4-7", H6→"5-7", H7→"6-7"
//
// A4→"3-0", B5→"4-1", C6→"5-2", D7→"6-3", E8→"7-4"
const WORD_POSITIONS: { [word: string]: string[] } = {
  GATO: ['1-1', '1-2', '1-3', '1-4'],
  CACHORRO: ['0-6', '1-6', '2-6', '3-6', '4-6', '5-6', '6-6', '7-6'],
  PASSARO: ['0-7', '1-7', '2-7', '3-7', '4-7', '5-7', '6-7'],
  PEIXE: ['3-0', '4-1', '5-2', '6-3', '7-4'],
};

// Cores base (HEX) para cada palavra
const WORD_BASE_COLORS: { [word: string]: string } = {
  GATO: '#FF0000',       // vermelho
  CACHORRO: '#008000',   // verde
  PASSARO: '#800080',    // roxo
  PEIXE: '#8B4513',      // marrom
};

// Converte HEX para RGBA com alpha
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Retorna a cor de sobreposição (RGBA) para a célula, se fizer parte de alguma palavra
const getCellOverlayColor = (key: string): string | undefined => {
  for (const word of WORDS) {
    if (WORD_POSITIONS[word].includes(key)) {
      return hexToRgba(WORD_BASE_COLORS[word], 0.4);
    }
  }
  return undefined;
};

// Grid 8×8
const letterGrid = [
  // Linha 1 (rowIndex=0)
  [
    require('../assets/images/letter-W.png'),
    require('../assets/images/letter-L.png'),
    require('../assets/images/letter-P.png'),
    require('../assets/images/letter-A.png'),
    require('../assets/images/letter-C.png'),
    require('../assets/images/letter-Y.png'),
    require('../assets/images/letter-C.png'),
    require('../assets/images/letter-P.png'),
  ],
  // Linha 2 (rowIndex=1)
  [
    require('../assets/images/letter-S.png'),
    require('../assets/images/letter-G.png'),
    require('../assets/images/letter-A.png'),
    require('../assets/images/letter-T.png'),
    require('../assets/images/letter-O.png'),
    require('../assets/images/letter-A.png'),
    require('../assets/images/letter-A.png'),
    require('../assets/images/letter-A.png'),
  ],
  // Linha 3 (rowIndex=2)
  [
    require('../assets/images/letter-V.png'),
    require('../assets/images/letter-O.png'),
    require('../assets/images/letter-R.png'),
    require('../assets/images/letter-C.png'),
    require('../assets/images/letter-O.png'),
    require('../assets/images/letter-R.png'),
    require('../assets/images/letter-C.png'),
    require('../assets/images/letter-S.png'),
  ],
  // Linha 4 (rowIndex=3)
  [
    require('../assets/images/letter-P.png'),
    require('../assets/images/letter-I.png'),
    require('../assets/images/letter-Z.png'),
    require('../assets/images/letter-V.png'),
    require('../assets/images/letter-K.png'),
    require('../assets/images/letter-A.png'),
    require('../assets/images/letter-H.png'),
    require('../assets/images/letter-S.png'),
  ],
  // Linha 5 (rowIndex=4)
  [
    require('../assets/images/letter-G.png'),
    require('../assets/images/letter-E.png'),
    require('../assets/images/letter-E.png'),
    require('../assets/images/letter-F.png'),
    require('../assets/images/letter-J.png'),
    require('../assets/images/letter-B.png'),
    require('../assets/images/letter-O.png'),
    require('../assets/images/letter-A.png'),
  ],
  // Linha 6 (rowIndex=5)
  [
    require('../assets/images/letter-G.png'),
    require('../assets/images/letter-N.png'),
    require('../assets/images/letter-I.png'),
    require('../assets/images/letter-B.png'),
    require('../assets/images/letter-Q.png'),
    require('../assets/images/letter-K.png'),
    require('../assets/images/letter-R.png'),
    require('../assets/images/letter-R.png'),
  ],
  // Linha 7 (rowIndex=6)
  [
    require('../assets/images/letter-C.png'),
    require('../assets/images/letter-C.png'),
    require('../assets/images/letter-Z.png'),
    require('../assets/images/letter-X.png'),
    require('../assets/images/letter-E.png'),
    require('../assets/images/letter-A.png'),
    require('../assets/images/letter-R.png'),
    require('../assets/images/letter-O.png'),
  ],
  // Linha 8 (rowIndex=7)
  [
    require('../assets/images/letter-D.png'),
    require('../assets/images/letter-C.png'),
    require('../assets/images/letter-E.png'),
    require('../assets/images/letter-R.png'),
    require('../assets/images/letter-E.png'),
    require('../assets/images/letter-J.png'),
    require('../assets/images/letter-O.png'),
    require('../assets/images/letter-I.png'),
  ],
];

export default function WordSearchScreen() {
  const navigation = useNavigation<WordSearchNavProp>();
  const { darkMode } = useTheme();
  const scheme = darkMode ? 'dark' : 'light';

  // Estado para células selecionadas (destacar sobreposição transparente)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  // Estado para palavras riscadas
  const [struckWords, setStruckWords] = useState<Set<string>>(new Set());

  // Calcula cellSize considerando 8 colunas
  const screenWidth = Dimensions.get('window').width;
  const totalHorizontalPadding = 16 + 6 * (NUM_COLS - 1);
  const cellSize = (screenWidth - totalHorizontalPadding) / NUM_COLS;

  const toggleCell = (row: number, col: number) => {
    const key = `${row}-${col}`;
    setSelectedCells(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleWordStrike = (word: string) => {
    setStruckWords(prev => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  const resetGame = () => {
    setSelectedCells(new Set());
    setStruckWords(new Set());
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[scheme].background }]}>
      {/* Cabeçalho com ícones de voltar e menu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={[styles.iconContainer, { backgroundColor: Colors[scheme].buttonBackground }]}>
            <Image
              source={require('../assets/images/back-icon.png')}
              style={styles.headerImage}
            />
          </View>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: '#ECAE55' }]}>
          Caça Palavras
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <View style={[styles.iconContainer, { backgroundColor: Colors[scheme].buttonBackground }]}>
            <Image
              source={require('../assets/images/user-icon.png')}
              style={styles.headerImage}
            />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Espaço extra entre título e lista de palavras */}
        <View style={{ height: 20 }} />

        {/* Lista de palavras em caixas clicáveis, centralizada */}
        <View style={styles.wordListContainer}>
          {WORDS.map((w, i) => {
            const isStruck = struckWords.has(w);
            return (
              <TouchableOpacity
                key={i}
                onPress={() => toggleWordStrike(w)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.wordBox,
                    {
                      borderColor: WORD_BASE_COLORS[w],
                      backgroundColor: isStruck
                        ? hexToRgba(WORD_BASE_COLORS[w], 0.2)
                        : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.wordText,
                      {
                        color: WORD_BASE_COLORS[w],
                        textDecorationLine: isStruck ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {w}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Espaço extra entre caixas de palavras e tabela */}
        <View style={{ height: 30 }} />

        {/* Grid de imagens clicáveis com fundo branco e sombra */}
        <View style={styles.gridWrapper}>
          <View style={styles.shadowBox}>
            <View style={styles.gridContainer}>
              {letterGrid.map((rowArr, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {rowArr.map((imgSource, colIndex) => {
                    const key = `${rowIndex}-${colIndex}`;
                    const isSelected = selectedCells.has(key);
                    const overlayColor = getCellOverlayColor(key);

                    return (
                      <TouchableOpacity
                        key={colIndex}
                        activeOpacity={0.8}
                        onPress={() => toggleCell(rowIndex, colIndex)}
                        style={[
                          {
                            width: cellSize,
                            height: cellSize,
                            marginRight: colIndex < NUM_COLS - 1 ? 2 : 0,
                            marginBottom: rowIndex < NUM_ROWS - 1 ? 2 : 0,
                            borderWidth: 2,
                            borderColor: '#003366',
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: 'transparent',
                          },
                        ]}
                      >
                        <Image
                          source={imgSource}
                          style={{ width: cellSize * 0.8, height: cellSize * 0.8 }}
                          resizeMode="contain"
                        />
                        {isSelected && overlayColor && (
                          <View
                            style={[
                              StyleSheet.absoluteFillObject,
                              { backgroundColor: overlayColor },
                            ]}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Espaço extra entre tabela e botões */}
        <View style={{ height: 30 }} />

        {/* Botões na parte inferior */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors[scheme].buttonBackground },
            ]}
            onPress={resetGame}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, { color: '#ECAE55' }]}>
              Tentar{'\n'}Novamente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors[scheme].buttonBackground },
            ]}
            onPress={() => {
              /* Próximo não faz nada por enquanto */
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, { color: '#ECAE55' }]}>
              Próximo
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header idêntico ao AboutScreen
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
  headerImage: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  wordListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordBox: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 6,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '600',
  },
  gridWrapper: {
    alignItems: 'center',
  },
  shadowBox: {
    backgroundColor: '#ffffff', // fundo branco atrás da tabela
    borderRadius: 8,
    // sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // sombra para Android
    elevation: 8,
    padding: 8,
  },
  gridContainer: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
