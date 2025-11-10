import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EndScreen = () => {
  const navigation = useNavigation();

  const handlePlayAgain = () => {
    // Reset the navigation stack to the Register screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Register' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complimenti!</Text>
      <Text style={styles.subtitle}>Hai completato la caccia al tesoro.</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Gioca di Nuovo"
          onPress={handlePlayAgain}
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
    backgroundColor: '#e3f2fd', // Light blue background
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0d47a1', // Dark blue text
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#1565c0', // Medium blue text
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
  }
});

export default EndScreen;
