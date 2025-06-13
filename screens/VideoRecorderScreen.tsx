import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_URL = 'http://74.163.240.20:8000';

export default function VideoRecorderScreen() {
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

      // Criar um FormData para enviar o vídeo
      const formData = new FormData();
      formData.append('video', {
        uri: selectedVideo,
        type: 'video/mp4',
        name: 'video.mp4'
      } as any);

      console.log('Enviando vídeo para API...');
      
      // Enviar para a API
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 30000, // 30 segundos de timeout
      });

      console.log('Resposta da API:', JSON.stringify(response.data, null, 2));

      // Atualizar o estado com a predição
      if (response.data) {
        // Tenta diferentes formatos possíveis de resposta
        const prediction = response.data.prediction || 
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
      } else {
        throw new Error('Resposta vazia da API');
      }
    } catch (error) {
      console.error('Erro ao processar vídeo:', error);
      
      let errorMessage = 'Erro ao processar vídeo';
      let errorDetails = 'Tente novamente';

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Tempo limite excedido';
          errorDetails = 'A conexão com o servidor demorou muito';
        } else if (!error.response) {
          errorMessage = 'Erro de conexão';
          errorDetails = 'Verifique sua conexão com a internet';
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tradução de Libras</Text>
        <Text style={styles.subtitle}>
          Selecione um vídeo para traduzir os sinais de libras
        </Text>
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
          <View style={styles.placeholderContainer}>
            <MaterialIcons name="video-library" size={64} color="#666" />
            <Text style={styles.placeholderText}>
              Nenhum vídeo selecionado
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={pickVideo}
          disabled={isProcessing}
        >
          <MaterialIcons name="upload-file" size={24} color="white" />
          <Text style={styles.buttonText}>Selecionar Vídeo</Text>
        </TouchableOpacity>

        {selectedVideo && !isProcessing && (
          <TouchableOpacity
            style={[styles.button, styles.processButton]}
            onPress={processVideo}
          >
            <MaterialIcons name="translate" size={24} color="white" />
            <Text style={styles.buttonText}>Traduzir</Text>
          </TouchableOpacity>
        )}
      </View>

      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.processingText}>Processando vídeo...</Text>
        </View>
      )}

      {prediction && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Tradução:</Text>
          <Text style={styles.resultText}>{prediction}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  processButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
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