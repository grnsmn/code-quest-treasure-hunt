import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const SuccessScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, questionData } = route.params;

  const hasNextStep = questionData && questionData.nextQuestionUnlockCode;

  const handleNextStep = () => {
    if (hasNextStep) {
      navigation.navigate('Unlock', {
        userId: userId,
        nextQuestionUnlockCode: questionData.nextQuestionUnlockCode,
        currentOrder: questionData.order
      });
    } else {
      navigation.navigate('End');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Risposta Corretta!</Text>
      <Text style={styles.clueHeader}>Ecco il tuo prossimo indizio:</Text>
      <Text style={styles.clueText}>{questionData.correctResponseText}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={hasNextStep ? "Ho trovato il codice" : "Concludi il Gioco"}
          onPress={handleNextStep}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e8f5e9', // A light green background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32', // Dark green text
    marginBottom: 20,
  },
  clueHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  clueText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 15,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 40,
    width: '80%',
  }
});

export default SuccessScreen;
