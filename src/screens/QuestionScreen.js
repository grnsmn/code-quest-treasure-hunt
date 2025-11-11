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
  const { userId, questionId } = route.params || {};

  const [questionData, setQuestionData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestion = async () => {
    setIsLoading(true);
    setQuestionData(null);
    try {
      let questionDoc;

      if (questionId) {
        // If questionId is passed via URL, fetch it directly
        const questionDocRef = doc(db, "questions", questionId);
        questionDoc = await getDoc(questionDocRef);
      } else {
        // Otherwise, get the user's current progress
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          Alert.alert("Errore", "Utente non trovato.");
          navigation.navigate("Register");
          return;
        }
        const userData = userDoc.data();
        const currentQuestionOrder = userData.currentQuestionOrder || 1;

        const questionsRef = collection(db, "questions");
        const q = query(
          questionsRef,
          where("order", "==", currentQuestionOrder)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          questionDoc = querySnapshot.docs[0];
        }
      }

      if (!questionDoc || !questionDoc.exists()) {
        navigation.navigate("End");
        return;
      }

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
      if (!userId) {
        navigation.navigate("Register", {
          nextScreen: "Question",
          questionId: questionId,
        });
        return;
      }
      fetchQuestion();
    }, [userId, questionId])
  );

  const handleAnswer = () => {
    if (!questionData) {
      Alert.alert(
        "Errore",
        "Dati della domanda non caricati. Impossibile verificare la risposta."
      );
      return;
    }
    if (answer.trim().toLowerCase() === questionData.answer.toLowerCase()) {
      setError("");
      setAnswer("");
      navigation.navigate("Success", {
        userId: userId,
        questionData: questionData,
      });
    } else {
      setError("Risposta Sbagliata. Riprova! Sei quasi lì.");
    }
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
        <Button
          title='Torna alla Home'
          onPress={() => navigation.navigate("Register")}
        />
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
        onChangeText={(text) => {
          setAnswer(text);
          if (error) {
            setError("");
          }
        }}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default QuestionScreen;
