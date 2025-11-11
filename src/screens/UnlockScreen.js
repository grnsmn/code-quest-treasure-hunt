import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { db } from "../config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const UnlockScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, nextQuestionUnlockCode, currentOrder } = route.params;

  const [manualCode, setManualCode] = useState("");
  const [error, setError] = useState("");

  const verifyCode = async (code) => {
    if (code.trim().toLowerCase() === nextQuestionUnlockCode.toLowerCase()) {
      try {
        // Update user's progress in Firebase
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          currentQuestionOrder: currentOrder + 1,
        });

        Alert.alert("Successo!", "Domanda sbloccata!");
        // Go back to the Question screen, which will auto-refresh to the new question
        navigation.pop(2);
      } catch (error) {
        console.error("Error updating user progress: ", error);
        Alert.alert("Errore", "Impossibile aggiornare i tuoi progressi.");
      }
    } else {
      setError("Codice Errato. Riprova.");
    }
  };

  const handleManualSubmit = () => {
    verifyCode(manualCode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Inserisci il codice manualmente:</Text>
      <TextInput
        style={styles.input}
        placeholder='Codice di sblocco'
        value={manualCode}
        onChangeText={(text) => {
          setManualCode(text);
          if (error) {
            setError("");
          }
        }}
        autoCapitalize='none'
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title='Conferma Codice' onPress={handleManualSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  separator: {
    alignItems: "center",
    marginVertical: 20,
  },
});

export default UnlockScreen;
