import {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import PaymentEmbed from './PaymentEmbed';
const Embebido = () => {
  const currentTimeUnix = Math.floor(Date.now()) * 1000;
  const transactionId = currentTimeUnix.toString().slice(0, 14);
  const orderNumber = currentTimeUnix.toString().slice(0, 10).toString();

  const MERCHANT_CODE = '4001834';
  const PUBLIC_KEY = 'VErethUtraQuxas57wuMuquprADrAHAb';
  const TRANSACTION_ID = transactionId;
  const ORDER_NUMBER = orderNumber;
  const ORDER_AMOUNT = '1.99';
  const ORDER_CURRENCY = 'PEN';

  const [token, setToken] = useState();
  const [pay,setPay]= useState(true);
  const [showEmbed, setShowEmbed] = useState(false);
  const getToken = () => {
    fetch('https://sandbox-api-pw.izipay.pe/security/v1/Token/Generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        transactionId: TRANSACTION_ID,
      },
      body: JSON.stringify({
        requestSource: 'ECOMMERCE',
        merchantCode: MERCHANT_CODE,
        orderNumber: ORDER_NUMBER,
        publicKey: PUBLIC_KEY,
        amount: ORDER_AMOUNT,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error de red o servidor');
        }
        return response.json();
      })
      .then(data => {
        setToken(data.response.token); // Almacena la respuesta en la variable responseData
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    getToken();
    if(token!==null){
        setPay(false)
    }
  }, [0]);

  const handleRedirect = () =>{
    setShowEmbed(true);
    
  }



  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>

    {!showEmbed && (
      <TouchableOpacity disabled={pay} onPress={handleRedirect}>
        <Text>
          Paga ahora {ORDER_CURRENCY} {ORDER_AMOUNT}
        </Text>
      </TouchableOpacity>
    )}


    {showEmbed && <PaymentEmbed token={token} transactionId={transactionId} orderNumber={orderNumber}/>}
  </View>
  );
};

export default Embebido;
