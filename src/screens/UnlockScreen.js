import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { db } from '../config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const UnlockScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, nextQuestionUnlockCode, currentOrder } = route.params;

  const [manualCode, setManualCode] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [startScanner, setStartScanner] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const verifyCode = async (code) => {
    if (code.trim().toLowerCase() === nextQuestionUnlockCode.toLowerCase()) {
      try {
        // Update user's progress in Firebase
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
          currentQuestionOrder: currentOrder + 1,
        });

        Alert.alert('Successo!', 'Domanda sbloccata!');
        // Go back to the Question screen, which will auto-refresh to the new question
        navigation.pop(2);

      } catch (error) {
        console.error("Error updating user progress: ", error);
        Alert.alert('Errore', 'Impossibile aggiornare i tuoi progressi.');
      }
    } else {
      Alert.alert('Codice Errato', 'Il codice inserito non è corretto. Riprova.');
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setStartScanner(false);
    verifyCode(data);
  };

  const handleManualSubmit = () => {
    verifyCode(manualCode);
  };
  
  const handleScanButton = () => {
    if (hasPermission === null) {
      Alert.alert('Permessi', 'Richiesta dei permessi per la fotocamera...');
    } else if (hasPermission === false) {
      Alert.alert('Permessi Negati', 'Per favore, abilita i permessi per la fotocamera nelle impostazioni del tuo dispositivo per usare lo scanner.');
    } else {
      setStartScanner(true);
    }
  };

  if (startScanner) {
    return (
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <Button title="Annulla Scansione" onPress={() => setStartScanner(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Inserisci il codice manualmente:</Text>
      <TextInput
        style={styles.input}
        placeholder="Codice di sblocco"
        value={manualCode}
        onChangeText={setManualCode}
        autoCapitalize="none"
      />
      <Button title="Conferma Codice" onPress={handleManualSubmit} />

      <View style={styles.separator}>
        <Text>oppure</Text>
      </View>

      <Button title="Scansiona QR Code" onPress={handleScanButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  scannerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  separator: {
    alignItems: 'center',
    marginVertical: 20,
  },
});

export default UnlockScreen;
