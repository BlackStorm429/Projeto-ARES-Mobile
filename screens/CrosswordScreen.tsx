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
}

type CrosswordNavProp = StackNavigationProp<RootStackParamList, 'Crossword'>;

export default function CrosswordScreen() {
  const navigation = useNavigation<CrosswordNavProp>();
  const { darkMode } = useTheme();
  const scheme = darkMode ? 'dark' : 'light';
  const themeColors = Colors[scheme];

  // Grid de 11 x 11
  const NUM_ROWS = 11;
  const NUM_COLS = 11;
  const margin = 4; // margem entre as células

  // Estado para cada letra inserida pelo usuário em cada “caixa” do crucigrama
  const [grid, setGrid] = useState<{ [key: string]: string }>({});
  // Estado para controlar quais palavras do Word Bank já foram riscadas
  const [struckWords, setStruckWords] = useState<Set<string>>(new Set());

  // Calcula o tamanho de cada caixinha (célula) com base na largura da tela
  const screenWidth = Dimensions.get('window').width;
  const totalMarginX = margin * (NUM_COLS + 1);
  const cellSize = (screenWidth - totalMarginX) / NUM_COLS;

  // Definição de cada palavra ↔ lista de posições (row, col) ↔ caminho da imagem do sinal
  //
  // 1) TELEFONE (horizontal em row=0, col=1..8)
  // 2) FOME     (vertical   em col=4, row=0..3)
  // 3) COMER    (horizontal em row=3, col=1..5)
  // 4) RUA      (vertical   em col=5, row=3..5)
  // 5) ÁGUA     (horizontal em row=5, col=3..6)
  // 6) AMIGO    (vertical   em col=6, row=5..9)
  // 7) LICENÇA  (horizontal em row=8, col=2..8)
  // 8) TRABALHO (horizontal em row=10, col=1..8)
  const words: WordInfo[] = [
    {
      name: 'TELEFONE',
      positions: [
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
        { row: 0, col: 4 }, // cruza com FOME em (0,4)
        { row: 0, col: 5 },
        { row: 0, col: 6 },
        { row: 0, col: 7 },
        { row: 0, col: 8 },
      ],
      image: require('../assets/images/phone.png'),
    },
    {
      name: 'FOME',
      positions: [
        { row: 0, col: 4 }, // cruza com TELEFONE em (0,4)
        { row: 1, col: 4 },
        { row: 2, col: 4 },
        { row: 3, col: 4 }, // cruza com COMER em (3,4)
      ],
      image: require('../assets/images/hungry.png'),
    },
    {
      name: 'COMER',
      positions: [
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 3, col: 4 }, // cruza com FOME em (3,4)
        { row: 3, col: 5 },
      ],
      image: require('../assets/images/eat.png'),
    },
    {
      name: 'RUA',
      positions: [
        { row: 3, col: 5 }, // cruza com COMER em (3,5)
        { row: 4, col: 5 },
        { row: 5, col: 5 }, // cruza com ÁGUA em (5,5)
      ],
      image: require('../assets/images/street.png'),
    },
    {
      name: 'ÁGUA',
      positions: [
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 }, // cruza com RUA em (5,5) – na prática, lá o usuário digita “A” para RUA e “U” para ÁGUA; 
                           // mas visualmente é a mesma célula compartilhada.
        { row: 5, col: 6 },
      ],
      image: require('../assets/images/water.png'),
    },
    {
      name: 'AMIGO',
      positions: [
        { row: 5, col: 6 }, // cruza com ÁGUA em (5,6) – ambas as letras “A”
        { row: 6, col: 6 },
        { row: 7, col: 6 },
        { row: 8, col: 6 }, // cruza com LICENÇA em (8,6)
        { row: 9, col: 6 },
      ],
      image: require('../assets/images/friend.png'),
    },
    {
      name: 'LICENÇA',
      positions: [
        { row: 8, col: 2 },
        { row: 8, col: 3 },
        { row: 8, col: 4 },
        { row: 8, col: 5 },
        { row: 8, col: 6 }, // cruza (na mesma caixinha) com “G” de AMIGO (8,6)
        { row: 8, col: 7 },
        { row: 8, col: 8 },
      ],
      image: require('../assets/images/excuse-me.png'),
    },
    {
      name: 'TRABALHO',
      positions: [
        { row: 10, col: 1 },
        { row: 10, col: 2 },
        { row: 10, col: 3 },
        { row: 10, col: 4 },
        { row: 10, col: 5 },
        { row: 10, col: 6 },
        { row: 10, col: 7 },
        { row: 10, col: 8 },
      ],
      image: require('../assets/images/work.png'),
    },
  ];

  // Verifica se a célula (row, col) pertence a alguma das palavras
  const isCellActive = (row: number, col: number): boolean => {
    return words.some((w) =>
      w.positions.some((p) => p.row === row && p.col === col)
    );
  };

  // Renderiza cada “caixa” com TextInput (onde o usuário digita 1 letra)
  const renderCells = () => {
    const cells: React.ReactNode[] = [];
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        if (!isCellActive(row, col)) continue;

        const key = `${row}-${col}`;
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
                borderColor: themeColors.text,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              maxLength={1}
              value={letter}
              onChangeText={(txt) => {
                setGrid((prev) => ({ ...prev, [key]: txt.toUpperCase() }));
              }}
              placeholder=""
              placeholderTextColor={themeColors.inputBackground}
            />
          </View>
        );
      }
    }
    return cells;
  };

  // Altera o estado “riscado” no Word Bank
  const toggleStruckWord = (word: string) => {
    setStruckWords((prev) => {
      const next = new Set(prev);
      next.has(word) ? next.delete(word) : next.add(word);
      return next;
    });
  };

  // Renderiza a imagem do sinal + seta para o início de cada palavra,
  // cuidando para NÃO sobrepor a célula (deixa pelo menos 16px de folga).
  const renderReferenceImages = () => {
    return words.map((w, idx) => {
      const firstPos = w.positions[0];
      const startTop = margin + firstPos.row * (cellSize + margin);
      const startLeft = margin + firstPos.col * (cellSize + margin);
      const imgSize = cellSize;
      const arrowSize = 24;

      // Detecta orientação vertical ou horizontal:
      const isVertical =
        w.positions.length > 1 &&
        w.positions[1].row > w.positions[0].row;

      if (isVertical) {
        // === Palavra vertical: coloca a imagem ACIMA do quadrado inicial,
        // e seta “arrow-down” apontando para dentro dele. ===
        const imgTop = startTop - (imgSize + 16);
        const imgLeft = startLeft;
        const arrowTop = startTop - arrowSize - 8; // 8px de folga
        const arrowLeft = startLeft + (imgSize - arrowSize) / 2;

        return (
          <View key={`ref-${idx}`} style={{ position: 'absolute' }}>
            {/* Imagem (sinal) bem acima da celinha */}
            <Image
              source={w.image}
              style={{
                width: imgSize,
                height: imgSize,
                position: 'absolute',
                top: imgTop,
                left: imgLeft,
              }}
            />
            {/* Seta para baixo,  sem sobrepor a imagem nem o quadrado */}
            <Ionicons
              name="arrow-down"
              size={arrowSize}
              color={themeColors.text}
              style={{
                position: 'absolute',
                top: arrowTop,
                left: arrowLeft,
              }}
            />
          </View>
        );
      } else {
        // === Palavra horizontal: coloca a imagem À ESQUERDA do quadrado inicial,
        // e seta “arrow-forward” apontando para dentro dele. ===
        const imgLeft = startLeft - (imgSize + 16);
        const imgTop = startTop;
        const arrowLeft = startLeft - arrowSize - 8; // 8px de folga
        const arrowTop = startTop + (imgSize - arrowSize) / 2;

        return (
          <View key={`ref-${idx}`} style={{ position: 'absolute' }}>
            {/* Imagem (sinal) bem à esquerda da celinha */}
            <Image
              source={w.image}
              style={{
                width: imgSize,
                height: imgSize,
                position: 'absolute',
                top: imgTop,
                left: imgLeft,
              }}
            />
            {/* Seta para a direita, sem sobrepor a imagem nem o quadrado */}
            <Ionicons
              name="arrow-forward"
              size={arrowSize}
              color={themeColors.text}
              style={{
                position: 'absolute',
                top: arrowTop,
                left: arrowLeft,
              }}
            />
          </View>
        );
      }
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

      {/* ===== TÍTULO “Palavra-Cruzada” ===== */}
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
        {renderReferenceImages()}
      </View>

      {/* ===== WORD BANK (caixa de palavras) logo abaixo ===== */}
      <View style={styles.wordBankContainer}>
        {words.map((w, idx) => {
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
  // Header com botões de “voltar” e “menu”
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
  // Título grande “Palavra-Cruzada”
  title: {
    fontSize: 24,
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  // Container do “tabuleiro” em si (posição: absoluta para cada célula)
  boardContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  // Cada “caixa” do crucigrama
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
  },
  wordBox: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#666',
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 6,
  },
  wordBoxText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
