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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
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
        Alert.alert(t("question.error"), t("question.userNotFound"));
        navigation.navigate("Register");
        return;
      }

      const userData = userDoc.data();
      const userCurrentQuestionOrder = userData.currentQuestionOrder || 1;

      let questionToFetchOrder;

      if (questionId) {
        const parsedQuestionIdAsOrder = parseInt(questionId, 10);
        if (isNaN(parsedQuestionIdAsOrder)) {
          Alert.alert(t("question.error"), t("question.invalidQuestionId"));
          navigation.navigate("Register");
          return;
        }

        if (parsedQuestionIdAsOrder > userCurrentQuestionOrder) {
          Alert.alert(
            t("question.questionLocked"),
            t("question.questionLockedMessage")
          );
          navigation.navigate("Register");
          return;
        }
        questionToFetchOrder = parsedQuestionIdAsOrder;
      } else if (questionId === undefined) {
        return;
      } else {
        questionToFetchOrder = userCurrentQuestionOrder;
      }

      const questionsRef = collection(db, "questions");
      const q = query(questionsRef, where("order", "==", questionToFetchOrder));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        navigation.navigate("End");
        return;
      }

      const questionDoc = querySnapshot.docs[0];
      setQuestionData({ id: questionDoc.id, ...questionDoc.data() });
    } catch (error) {
      console.error("Error fetching question: ", error);
      Alert.alert(t("question.error"), t("question.loadError"));
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
      Alert.alert(t("question.error"), t("question.dataNotLoaded"));
      return;
    }

    if (answer.trim().toLowerCase() === questionData.answer.toLowerCase()) {
      setError("");
      setAnswer("");

      try {
        if (questionData.isLastQuestion === true) {
          const redemptionCode = generateRedemptionCode();
          navigation.navigate("End", { redemptionCode: redemptionCode });
        } else {
          const nextQuestionOrder = questionData.order + 1;
          const userDocRef = doc(db, "users", currentUserId);
          await updateDoc(userDocRef, {
            currentQuestionOrder: nextQuestionOrder,
          });

          navigation.replace("Success", {
            userId: currentUserId,
            questionData: questionData,
          });
        }
      } catch (error) {
        console.error("Error updating user progress or navigating:", error);
        Alert.alert(t("question.error"), t("question.updateErrorNav"));
      }
    } else {
      setError(t("question.wrongAnswer"));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{t("question.loadingQuestion")}</Text>
      </View>
    );
  }

  if (!questionData) {
    return (
      <View style={styles.container}>
        <Text>{t("question.noQuestion")}</Text>
        <Button
          title={t("question.backHome")}
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
          placeholder={t("question.answerPlaceholder")}
          value={answer}
          onChangeText={(text) => {
            setAnswer(text);
            if (error) {
              setError("");
            }
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button title={t("question.submitButton")} onPress={handleAnswer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "stretch",
  },
  titleContainer: {
    paddingTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
