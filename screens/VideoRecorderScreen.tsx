import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { Camera, CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

const VideoRecorderScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [zoom, setZoom] = useState(0); // 0 = 1x, 1 = máximo
  const [recordingTime, setRecordingTime] = useState(0);
  const cameraRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTime = useRef<number | null>(null);

  React.useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(
        cameraStatus === 'granted' &&
        mediaStatus.status === 'granted'
      );
    })();
  }, []);

  React.useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    if (!hasPermission) {
      Alert.alert('Permissão', 'Permissões necessárias não concedidas.');
      return;
    }
    if (cameraRef.current) {
      setIsRecording(true);
      setRecordingTime(0);
      recordingStartTime.current = Date.now();
      try {
        const video = await cameraRef.current.recordAsync({ mute: true });
        setIsRecording(false);
        await saveVideo(video.uri);
      } catch (error) {
        setIsRecording(false);
        const msg = error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error);
        Alert.alert('Erro ao gravar', msg);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      // Previne parar muito rápido
      if (recordingStartTime.current && Date.now() - recordingStartTime.current < 1200) {
        Alert.alert('Atenção', 'Grave pelo menos 1 segundo antes de parar.');
        return;
      }
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const saveVideo = async (uri: string) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      Alert.alert('Vídeo salvo!', 'O vídeo foi salvo na galeria. Confira no app Galeria ou Meus Arquivos.');
    } catch (error) {
      const msg = error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error);
      Alert.alert('Erro ao salvar vídeo', msg);
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Permissão negada para acessar a câmera.</Text>;
  }

  // Zoom visual para mostrar 1x até 8x
  const getZoomLabel = () => {
    // expo-camera: zoom 0 = 1x, 1 = 8x
    const zoomValue = 1 + zoom * 7;
    return `${zoomValue.toFixed(1)}x`;
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={cameraType}
        ref={cameraRef}
        zoom={zoom}
      >
        {/* Contador de tempo de gravação */}
        {isRecording && (
          <View style={styles.timerContainer}>
            <View style={styles.timerDot} />
            <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
          </View>
        )}
        {/* Seletor de modo com zoom acima de VÍDEO (apenas visual agora) */}
        <View style={styles.modeSelectorContainer}>
          <View style={{flex:1, alignItems:'center'}} />
          <View style={styles.modeSelectorCenter}>
            <View style={styles.zoomIndicatorAbove}>
              <Text style={styles.zoomText}>{getZoomLabel()}</Text>
            </View>
            <View style={styles.modeSelector}>
              <Text style={styles.modeText}>FOTO</Text>
              <View style={styles.selectedMode}><Text style={styles.selectedModeText}>VÍDEO</Text></View>
              <Text style={styles.modeText}>MAIS</Text>
            </View>
            {/* Slider de zoom */}
            <Slider
              style={{width: 180, marginTop: 8}}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={zoom}
              onValueChange={setZoom}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#888"
              thumbTintColor="#fff"
            />
          </View>
          <View style={{flex:1, alignItems:'center'}} />
        </View>
        {/* Barra inferior com botões */}
        <View style={styles.bottomBar}>
          {/* Botão de galeria (imagem estática como exemplo) */}
          <TouchableOpacity style={styles.galleryButton}>
            <Image source={{uri: 'https://img.icons8.com/ios-filled/50/ffffff/picture.png'}} style={styles.galleryIcon} />
          </TouchableOpacity>
          {/* Botão de gravação */}
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            style={styles.recordButton}
            activeOpacity={0.7}
          >
            <View style={[styles.innerCircle, isRecording && styles.innerCircleRecording]} />
          </TouchableOpacity>
          {/* Botão de inverter câmera */}
          <TouchableOpacity
            onPress={toggleCameraType}
            style={styles.flipButton}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-reverse" size={36} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  timerContainer: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    zIndex: 30,
  },
  timerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginRight: 8,
  },
  timerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modeSelectorContainer: {
    position: 'absolute',
    bottom: 120,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 10,
  },
  modeSelectorCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomIndicatorAbove: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 4,
    alignSelf: 'center',
  },
  zoomText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  modeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modeText: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 18,
    opacity: 0.7,
  },
  selectedMode: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 2,
    marginHorizontal: 8,
  },
  selectedModeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 30,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  galleryButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,0,0,0.7)',
  },
  innerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'red',
  },
  innerCircleRecording: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'red',
  },
  flipButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default VideoRecorderScreen;