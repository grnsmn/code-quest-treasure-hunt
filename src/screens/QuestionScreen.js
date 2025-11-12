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
import { db, auth } from "../config/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const QuestionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { questionId } = route.params || {};

  const [currentUserId, setCurrentUserId] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        navigation.navigate("Register");
      }
    });
    return unsubscribe;
  }, []);

  const generateRedemptionCode = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `DEVFEST-CT-2025-${randomSuffix}`;
  };

  const fetchQuestion = async () => {
    if (!currentUserId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setQuestionData(null);
    try {
      const userDocRef = doc(db, "users", currentUserId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        Alert.alert("Errore", "Dati utente non trovati.");
        navigation.navigate("Register");
        return;
      }

      const userData = userDoc.data();
      const userCurrentQuestionOrder = userData.currentQuestionOrder || 1;

      let questionToFetchOrder;

      if (questionId) {
        const parsedQuestionIdAsOrder = parseInt(questionId, 10);
        if (isNaN(parsedQuestionIdAsOrder)) {
          Alert.alert("Errore", "ID domanda non valido.");
          navigation.navigate("Register");
          return;
        }

        if (parsedQuestionIdAsOrder > userCurrentQuestionOrder) {
          Alert.alert(
            "Domanda Bloccata",
            "Non hai ancora sbloccato questa domanda. Rispondi a quella attuale per procedere."
          );
          navigation.navigate("Register");
          return;
        }
        questionToFetchOrder = parsedQuestionIdAsOrder;
      } else {
        questionToFetchOrder = userCurrentQuestionOrder;
      }

      const questionsRef = collection(db, "questions");
      const q = query(
        questionsRef,
        where("order", "==", questionToFetchOrder)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
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
      if (currentUserId) {
        fetchQuestion();
      }
    }, [currentUserId, questionId])
  );

  const handleAnswer = async () => {
    if (!questionData) {
      Alert.alert("Errore", "Dati della domanda non caricati.");
      return;
    }

    if (answer.trim().toLowerCase() === questionData.answer.toLowerCase()) {
      setError("");
      setAnswer("");

      try {
        if (questionData.isLastQuestion === true) {
          // Last question answered correctly
          const redemptionCode = generateRedemptionCode();
          navigation.navigate("End", { redemptionCode: redemptionCode });
        } else {
          // Not the last question, update progress and go to Success
          const nextQuestionOrder = questionData.order + 1;
          const userDocRef = doc(db, "users", currentUserId);
          await updateDoc(userDocRef, {
            currentQuestionOrder: nextQuestionOrder,
          });

          navigation.navigate("Success", {
            userId: currentUserId,
            questionData: questionData,
          });
        }
      } catch (error) {
        console.error("Error updating user progress or navigating:", error);
        Alert.alert(
          "Errore",
          "Impossibile aggiornare i tuoi progressi o navigare. Riprova."
        );
      }
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
      {questionData.title && (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{questionData.title}</Text>
        </View>
      )}
      <View style={styles.contentContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Removed justifyContent and alignItems from here to allow children to control their layout
    padding: 20,
    alignItems: "stretch", // Allows children to stretch horizontally
  },
  titleContainer: {
    paddingTop: 20, // Add some padding from the top of the screen
    marginBottom: 20,
    alignItems: "center", // Center the title horizontally
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1, // Takes up remaining space
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    width: "100%", // Ensures content takes full width
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
