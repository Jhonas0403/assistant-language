import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import WebView from 'react-native-webview';

const PaymentEmbed = (props: { token: any, transactionId:any, orderNumber:any }) => {
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const {token, transactionId, orderNumber} =props;
  const iziConfig = {
    publicKey: 'VErethUtraQuxas57wuMuquprADrAHAb',
    config: {
      transactionId: transactionId,
      action: "pay",
      merchantCode: '4001834',
      order: {
        orderNumber: orderNumber,
        currency: 'PEN',
        amount: '1.99',
        processType: "AT",
        merchantBuyerId: "mc1768",
        dateTimeTransaction: "1670258741603000", //currentTimeUnix
      },
      billing: {
        firstName: "Darwin",
        lastName: "Paniagua",
        email: "demo@izipay.pe",
        phoneNumber: "989339999",
        street: "calle el demo",
        city: "lima",
        state: "lima",
        country: "PE",
        postalCode: "00001",
        document: "12345678",
        documentType: "DNI",
      },
    },
  };

  useEffect(() => {    
    const initializeIzipaySDK = `
    console.log('Inicializando el SDK de Izipay...');
    const izi = new Izipay({
      publicKey: '${iziConfig.publicKey}',
      config: ${JSON.stringify(iziConfig.config)}
    });
    if (izi) {
      console.log('El SDK de Izipay se ha inicializado correctamente.');
      window.ReactNativeWebView.postMessage('SDK_INITIALIZED');
    } else {
      console.log('Error al inicializar el SDK de Izipay.');
    }
  `;
    // Ejecutar la función de inicialización del SDK dentro del WebView
    webviewRef?.injectJavaScript(initializeIzipaySDK);
  }, []);

  const handleWebViewMessage = (event: any) => {
    if (event.nativeEvent.data === 'SDK_INITIALIZED') {
      // SDK inicializado correctamente
      console.log("entra aqui*--------------------*");
      
      setSdkInitialized(true);
    }
  };

  const handlePayment = () => {
    if (sdkInitialized) {
      // Realizar operación de pago
      // Aquí puedes agregar la lógica para realizar el pago
    } else {
      console.log('El SDK no se ha inicializado correctamente.');
    }
  };

  let webviewRef: WebView | null;

  return (
    <View>
      <WebView
        ref={(ref) => (webviewRef = ref)}
        originWhitelist={['*']}
        source={{ uri: 'https://sandbox-checkout.izipay.pe/payments/v1/js/index.js' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onMessage={handleWebViewMessage}
      />
      <Button title="Realizar pago" onPress={handlePayment} />
    </View>
  );
};

export default PaymentEmbed;
