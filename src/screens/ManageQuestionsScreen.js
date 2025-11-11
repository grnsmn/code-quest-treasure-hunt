import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { db } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const ManageQuestionsScreen = () => {
  const [order, setOrder] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answer, setAnswer] = useState("");
  const [correctResponseText, setCorrectResponseText] = useState("");
  const [nextQuestionUnlockCode, setNextQuestionUnlockCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const flatListRef = useRef(null);

  const fetchQuestions = async () => {
    setIsFetchingQuestions(true);
    try {
      const q = query(collection(db, "questions"), orderBy("order"));
      const querySnapshot = await getDocs(q);
      const questionsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(questionsList);
    } catch (error) {
      console.error("Error fetching questions: ", error);
      Alert.alert("Errore", "Impossibile caricare le domande esistenti.");
    } finally {
      setIsFetchingQuestions(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchQuestions();
  };

  const clearForm = () => {
    setOrder("");
    setQuestionText("");
    setAnswer("");
    setCorrectResponseText("");
    setNextQuestionUnlockCode("");
    setEditingQuestionId(null);
  };

  const handleAddOrUpdateQuestion = async () => {
    if (!order || !questionText || !answer || !correctResponseText) {
      Alert.alert(
        "Errore",
        "Per favore, compila tutti i campi obbligatori (Ordine, Domanda, Risposta, Testo Risposta Corretta)."
      );
      return;
    }
    if (isNaN(parseInt(order))) {
      Alert.alert("Errore", "Il campo Ordine deve essere un numero.");
      return;
    }

    setIsLoading(true);
    try {
      const questionData = {
        order: parseInt(order),
        questionText: questionText.trim(),
        answer: answer.trim().toLowerCase(),
        correctResponseText: correctResponseText.trim(),
        ...(nextQuestionUnlockCode.trim() && {
          nextQuestionUnlockCode: nextQuestionUnlockCode.trim(),
        }),
      };

      if (editingQuestionId) {
        const questionRef = doc(db, "questions", editingQuestionId);
        await updateDoc(questionRef, questionData);
        Alert.alert("Successo", "Domanda aggiornata con successo!");
      } else {
        await addDoc(collection(db, "questions"), questionData);
        Alert.alert("Successo", "Domanda aggiunta con successo!");
      }

      clearForm();
      fetchQuestions();
    } catch (error) {
      console.error("Error adding/updating question: ", error);
      Alert.alert("Errore", "Impossibile salvare la domanda.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestionId(question.id);
    setOrder(String(question.order));
    setQuestionText(question.questionText);
    setAnswer(question.answer);
    setCorrectResponseText(question.correctResponseText);
    setNextQuestionUnlockCode(question.nextQuestionUnlockCode || "");
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const handleDelete = async (questionId) => {
    Alert.alert(
      "Conferma Eliminazione",
      "Sei sicuro di voler eliminare questa domanda?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteDoc(doc(db, "questions", questionId));
              Alert.alert("Successo", "Domanda eliminata con successo!");
              fetchQuestions();
            } catch (error) {
              console.error("Error deleting question: ", error);
              Alert.alert("Errore", "Impossibile eliminare la domanda.");
            } finally {
              setIsLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderQuestionItem = ({ item }) => (
    <View style={styles.questionItem}>
      <Text style={styles.questionItemOrder}>Ordine: {item.order}</Text>
      <Text style={styles.questionItemText}>{item.questionText}</Text>
      <Text>Risposta: {item.answer}</Text>
      <Text>Indizio: {item.correctResponseText}</Text>
      {item.nextQuestionUnlockCode && (
        <Text>Codice Sblocco: {item.nextQuestionUnlockCode}</Text>
      )}
      <View style={styles.itemActions}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={[styles.actionButton, styles.editButton]}
        >
          <Text style={styles.actionButtonText}>Modifica</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Text style={styles.actionButtonText}>Elimina</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <>
      <Text style={styles.title}>
        {editingQuestionId ? "Modifica Domanda" : "Aggiungi Nuova Domanda"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ordine (es. 1, 2, 3)"
        value={order}
        onChangeText={setOrder}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Testo della Domanda"
        value={questionText}
        onChangeText={setQuestionText}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Risposta Corretta (tutto minuscolo)"
        value={answer}
        onChangeText={setAnswer}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Testo Risposta Corretta / Indizio"
        value={correctResponseText}
        onChangeText={setCorrectResponseText}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Codice Sblocco Domanda Successiva (lascia vuoto per l'ultima domanda)"
        value={nextQuestionUnlockCode}
        onChangeText={setNextQuestionUnlockCode}
        autoCapitalize="none"
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <Button
            title={editingQuestionId ? "Aggiorna Domanda" : "Aggiungi Domanda"}
            onPress={handleAddOrUpdateQuestion}
          />
          {editingQuestionId && (
            <View style={styles.cancelButtonContainer}>
              <Button
                title="Annulla Modifica"
                onPress={clearForm}
                color="gray"
              />
            </View>
          )}
        </View>
      )}
      <Text style={styles.listHeader}>Domande Esistenti</Text>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
    >
      <View style={styles.container}>
        {isFetchingQuestions ? (
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
        ) : (
          <FlatList
            ref={flatListRef}
            data={questions}
            renderItem={renderQuestionItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>
                Nessuna domanda ancora. Aggiungine una!
              </Text>
            }
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContentContainer: {
    padding: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    minHeight: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  listHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
    textAlign: "center",
  },
  questionItem: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  questionItemOrder: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  questionItemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButtonContainer: {
    marginTop: 10,
  },
});

export default ManageQuestionsScreen;