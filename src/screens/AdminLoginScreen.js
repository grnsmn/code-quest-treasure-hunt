import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const checkAdminRoleAndNavigate = async (user) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().role === 'admin') {
      Alert.alert('Successo', 'Login come admin effettuato.');
      navigation.navigate('AdminDashboard');
    } else {
      Alert.alert('Accesso Negato', 'Questo utente non ha i privilegi di amministratore.');
      auth.signOut();
    }
  };

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Errore', 'Per favore, inserisci email e password.');
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await checkAdminRoleAndNavigate(userCredential.user);
    } catch (error) {
      Alert.alert('Errore di Login', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (email === '' || password === '') {
      Alert.alert('Errore', 'Per favore, inserisci email e password.');
      return;
    }
    setIsLoading(true);
    try {
      // 1. Create user in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create user document in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        username: email.split('@')[0], // Use part of email as initial username
        email: email,
      });

      Alert.alert(
        'Account Creato',
        "Il tuo account è stato creato. Ora vai nella console di Firestore, trova questo utente e aggiungi il campo 'role' con valore 'admin', poi effettua il login."
      );
    } catch (error) {
      Alert.alert('Errore di Creazione', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accesso Admin</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} />
          <View style={styles.separator} />
          <Button title="Crea Account Admin" onPress={handleCreateAccount} color="#841584" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  separator: {
    height: 10,
  }
});

export default AdminLoginScreen;
