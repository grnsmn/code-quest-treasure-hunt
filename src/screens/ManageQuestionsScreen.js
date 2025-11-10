import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, FlatList, RefreshControl, ScrollView } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const ManageQuestionsScreen = () => {
  const [order, setOrder] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');
  const [correctResponseText, setCorrectResponseText] = useState('');
  const [nextQuestionUnlockCode, setNextQuestionUnlockCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchQuestions = async () => {
    setIsFetchingQuestions(true);
    try {
      const q = query(collection(db, 'questions'), orderBy('order'));
      const querySnapshot = await getDocs(q);
      const questionsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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

  const handleAddQuestion = async () => {
    if (!order || !questionText || !answer || !correctResponseText) {
      Alert.alert('Errore', 'Per favore, compila tutti i campi obbligatori (Ordine, Domanda, Risposta, Testo Risposta Corretta).');
      return;
    }
    if (isNaN(parseInt(order))) {
      Alert.alert('Errore', 'Il campo Ordine deve essere un numero.');
      return;
    }

    setIsLoading(true);
    try {
      const newQuestion = {
        order: parseInt(order),
        questionText: questionText.trim(),
        answer: answer.trim().toLowerCase(), // Store answer in lowercase
        correctResponseText: correctResponseText.trim(),
        ...(nextQuestionUnlockCode.trim() && { nextQuestionUnlockCode: nextQuestionUnlockCode.trim() }), // Only add if not empty
      };

      await addDoc(collection(db, 'questions'), newQuestion);
      Alert.alert('Successo', 'Domanda aggiunta con successo!');
      
      // Clear form
      setOrder('');
      setQuestionText('');
      setAnswer('');
      setCorrectResponseText('');
      setNextQuestionUnlockCode('');
      
      // Refresh list
      fetchQuestions();

    } catch (error) {
      console.error("Error adding question: ", error);
      Alert.alert('Errore', 'Impossibile aggiungere la domanda.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestionItem = ({ item }) => (
    <View style={styles.questionItem}>
      <Text style={styles.questionItemOrder}>Ordine: {item.order}</Text>
      <Text style={styles.questionItemText}>{item.questionText}</Text>
      <Text>Risposta: {item.answer}</Text>
      <Text>Indizio: {item.correctResponseText}</Text>
      {item.nextQuestionUnlockCode && <Text>Codice Sblocco: {item.nextQuestionUnlockCode}</Text>}
      {/* Add Edit/Delete buttons here later */}
    </View>
  );

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
      <Text style={styles.title}>Aggiungi Nuova Domanda</Text>
      
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
        <Button title="Aggiungi Domanda" onPress={handleAddQuestion} />
      )}

      <Text style={styles.listHeader}>Domande Esistenti</Text>
      {isFetchingQuestions ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={questions}
          renderItem={renderQuestionItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.emptyListText}>Nessuna domanda ancora. Aggiungine una!</Text>}
          scrollEnabled={false} // FlatList inside ScrollView
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    minHeight: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  questionItem: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  questionItemOrder: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  questionItemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  }
});

export default ManageQuestionsScreen;
