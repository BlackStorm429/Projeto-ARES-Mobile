import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/Colors';

const backIcon = require('../assets/images/back-icon.png');
const userIcon = require('../assets/images/user-icon.png');

const { width } = Dimensions.get('window');
const API_URL = 'http://74.163.240.20:8000';

type NavProp = StackNavigationProp<RootStackParamList, 'VideoRecorder'>;

export default function VideoRecorderScreen() {
  const navigation = useNavigation<NavProp>();
  const { darkMode } = useTheme();
  const scheme = darkMode ? 'dark' : 'light';
  const themeColors = Colors[scheme];
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const videoRef = useRef<Video>(null);

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 10,
      });

      if (!result.canceled && result.assets[0].uri) {
        setSelectedVideo(result.assets[0].uri);
        setPrediction(null); // Limpa predição anterior
      }
    } catch (error) {
      console.error('Erro ao selecionar vídeo:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o vídeo');
    }
  };

  const processVideo = async () => {
    if (!selectedVideo) {
      Alert.alert('Atenção', 'Selecione um vídeo primeiro');
      return;
    }

    try {
      setIsProcessing(true);
      setPrediction(null);

      // Aguarda um momento antes de iniciar a requisição
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Criar um FormData para enviar o vídeo
      const formData = new FormData();
      const videoFile = {
        uri: selectedVideo,
        type: 'video/mp4',
        name: 'video.mp4'
      };
      
      formData.append('video', videoFile as any);

      console.log('Preparando requisição para API...');
      console.log('URL:', `${API_URL}/predict`);
      console.log('Video URI:', selectedVideo);
      
      // Criar uma nova instância do Axios para cada requisição
      const axiosInstance = axios.create({
        timeout: 60000, // Aumentado para 60 segundos
        headers: {
          'Accept': 'application/json',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      // Adicionar interceptor para logs
      axiosInstance.interceptors.request.use(request => {
        console.log('Iniciando requisição:', request);
        return request;
      });

      axiosInstance.interceptors.response.use(
        response => {
          console.log('Resposta recebida:', response);
          return response;
        },
        error => {
          console.error('Erro na requisição:', error);
          return Promise.reject(error);
        }
      );

      console.log('Enviando vídeo para API...');
      
      // Enviar para a API
      const response = await axiosInstance.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
          return data;
        },
      });

      console.log('Resposta da API:', JSON.stringify(response.data, null, 2));

      // Atualizar o estado com a predição
      if (response.data) {
        // Tenta diferentes formatos possíveis de resposta
        const prediction = response.data.gesture || 
                          response.data.prediction || 
                          response.data.result || 
                          response.data.label || 
                          response.data.text ||
                          JSON.stringify(response.data);
                          
        setPrediction(prediction);
        
        Toast.show({
          type: 'success',
          text1: 'Vídeo processado com sucesso!',
          position: 'top',
          visibilityTime: 2000,
        });

        // Limpa o vídeo após processamento bem-sucedido
        setSelectedVideo(null);
        if (videoRef.current) {
          videoRef.current.stopAsync();
        }
      } else {
        throw new Error('Resposta vazia da API');
      }
    } catch (error) {
      console.error('Erro ao processar vídeo:', error);
      
      let errorMessage = 'Erro ao processar vídeo';
      let errorDetails = 'Tente novamente';

      if (axios.isAxiosError(error)) {
        console.error('Detalhes do erro Axios:', {
          message: error.message,
          code: error.code,
          response: error.response,
          request: error.request
        });

        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Tempo limite excedido';
          errorDetails = 'A conexão com o servidor demorou muito';
        } else if (!error.response) {
          errorMessage = 'Erro de conexão';
          errorDetails = 'Verifique sua conexão com a internet e tente novamente';
        } else if (error.response.status === 413) {
          errorMessage = 'Vídeo muito grande';
          errorDetails = 'Tente selecionar um vídeo mais curto';
        } else {
          errorMessage = `Erro ${error.response.status}`;
          errorDetails = error.response.data?.message || 
                        error.response.data?.error || 
                        JSON.stringify(error.response.data) || 
                        'Tente novamente';
        }
      }

      Toast.show({
        type: 'error',
        text1: errorMessage,
        text2: errorDetails,
        position: 'top',
        visibilityTime: 3000,
      });

      // Em caso de erro, limpa o vídeo para permitir nova tentativa
      setSelectedVideo(null);
      if (videoRef.current) {
        videoRef.current.stopAsync();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }] }>
      {/* Header com ícones */}
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.buttonBackground }] }>
            <Image source={backIcon} style={styles.headerImage} />
          </View>
        </TouchableOpacity>
        <View style={{ width: 24 }} />
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.buttonBackground }] }>
            <Image source={userIcon} style={styles.headerImage} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={[styles.title, {
          color: themeColors.text,
          textShadowColor: '#000',
          textShadowOffset: { width: -1, height: 1 },
          textShadowRadius: 1,
          marginTop: 32
        }]}>Tradução de Libras</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary, marginTop: 16 }]}>Selecione um vídeo para traduzir os sinais de libras</Text>
      </View>

      <View style={styles.videoContainer}>
        {selectedVideo ? (
          <Video
            ref={videoRef}
            source={{ uri: selectedVideo }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
          />
        ) : (
          <View style={[styles.placeholderContainer, { backgroundColor: themeColors.inputBackground }] }>
            <MaterialIcons name="video-library" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.placeholderText, { color: themeColors.textSecondary }]}>Nenhum vídeo selecionado</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.buttonBackground }]}
          onPress={pickVideo}
          disabled={isProcessing}
        >
          <MaterialIcons name="upload-file" size={24} color={themeColors.text} />
          <Text style={[styles.buttonText, { color: themeColors.text }]}>Selecionar Vídeo</Text>
        </TouchableOpacity>

        {selectedVideo && !isProcessing && (
          <TouchableOpacity
            style={[styles.button, styles.processButton, { backgroundColor: '#34C759' }]}
            onPress={processVideo}
          >
            <MaterialIcons name="translate" size={24} color="white" />
            <Text style={[styles.buttonText, { color: 'white' }]}>Traduzir</Text>
          </TouchableOpacity>
        )}
      </View>

      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={themeColors.text} />
          <Text style={[styles.processingText, { color: themeColors.textSecondary }]}>Processando vídeo...</Text>
        </View>
      )}

      {prediction && (
        <View style={[styles.resultContainer, { backgroundColor: themeColors.buttonBackground }] }>
          <Text style={[styles.resultTitle, { color: themeColors.text }]}>Tradução:</Text>
          <Text style={[styles.resultText, { color: themeColors.textSecondary }]}>{prediction}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerIcons: {
    width: '100%',
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  videoContainer: {
    width: width - 40,
    height: width - 40,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  video: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  processButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  processingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  processingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
}); 