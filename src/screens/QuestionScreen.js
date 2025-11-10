import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { db } from "../config/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

const QuestionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;

  const [questionData, setQuestionData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestion = async () => {
    setIsLoading(true);
    setQuestionData(null); // Reset question data on each fetch
    try {
      // First, get the user's current progress
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        Alert.alert("Errore", "Utente non trovato.");
        navigation.navigate("Register");
        return;
      }

      const userData = userDoc.data();
      // Provide a default value of 1 if currentQuestionOrder is missing
      const currentQuestionOrder = userData.currentQuestionOrder || 1; 

      // Then, fetch the question corresponding to the user's progress
      const questionsRef = collection(db, "questions");
      const q = query(questionsRef, where("order", "==", currentQuestionOrder));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If no question is found for the current order, assume the game is over.
        navigation.navigate("End");
        return;
      }

      const questionDoc = querySnapshot.docs[0];
      setQuestionData({ id: questionDoc.id, ...questionDoc.data() });

    } catch (error) {
      console.error("Error fetching question: ", error);
      Alert.alert("Errore", "Impossibile caricare la domanda.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchQuestion();
    }, [userId])
  );

  const handleAnswer = () => {
    if (!questionData) {
      Alert.alert("Errore", "Dati della domanda non caricati. Impossibile verificare la risposta.");
      return;
    }
    if (answer.trim().toLowerCase() === questionData.answer.toLowerCase()) {
      // Correct answer
      navigation.navigate("Success", {
        userId: userId,
        questionData: questionData,
      });
    } else {
      // Incorrect answer
      Alert.alert("Risposta Sbagliata", "Riprova! Sei quasi lì.");
    }
    setAnswer(""); // Clear input field
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#0000ff' />
        <Text>Caricamento domanda...</Text>
      </View>
    );
  }

  if (!questionData) {
    return (
      <View style={styles.container}>
        <Text>Nessuna domanda trovata. Potresti aver finito il gioco!</Text>
        <Button title='Torna alla Home' onPress={() => navigation.navigate("Register")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{questionData.questionText}</Text>
      <TextInput
        style={styles.input}
        placeholder='Scrivi la tua risposta qui'
        value={answer}
        onChangeText={setAnswer}
      />
      <Button title='Conferma Risposta' onPress={handleAnswer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  questionText: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
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
});

export default QuestionScreen;
