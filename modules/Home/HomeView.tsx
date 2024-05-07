import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {Camera, useCameraDevice, useCameraPermission} from 'react-native-vision-camera';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import {loadLayersModel} from '@tensorflow/tfjs';
// import Prueba from '../CNN/modelo.h5'

export default function HomeView() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('front');
  const cameraRef = useRef<Camera>(null);


  // Cargar el modelo al inicio
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await loadLayersModel('../CNN/modelo.h5');
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // Función para procesar las imágenes de la cámara y hacer predicciones
  const handleCapture = async () => {
    if (!model || !cameraRef.current) return;
    setIsProcessing(true);
    const picture = await cameraRef.current.takePhoto();
    const imgTensor = tf.browser.fromPixels(picture);
    // Preprocesar la imagen según sea necesario (puede requerir redimensionamiento, normalización, etc.)
    // Hacer predicciones utilizando el modelo
    const prediction = model.predict(imgTensor);
    // Procesar las predicciones y realizar las acciones correspondientes
    // (por ejemplo, mostrar un mensaje si se detecta un gesto específico)
    setIsProcessing(false);
  };

  if (!hasPermission) return <Text>Sin permiso</Text>;
  if (device == null) return <Text>Sin Camara</Text>;

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
      />
      <Button
        title="Capturar"
        onPress={handleCapture}
        disabled={isProcessing}
      />
      {isProcessing && <Text>Procesando...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
