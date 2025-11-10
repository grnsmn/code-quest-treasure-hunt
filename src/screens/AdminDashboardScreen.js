import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig';

const AdminDashboardScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.navigate('Register');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pannello Admin</Text>
      <Text>Benvenuto, admin!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Gestisci Domande" onPress={() => navigation.navigate('ManageQuestions')} />
        <View style={{height: 10}}/>
        <Button title="Visualizza Utenti" onPress={() => navigation.navigate('ViewUsers')} />
        <View style={{height: 20}}/>
        <Button title="Logout" onPress={handleLogout} color="red" />
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
      marginTop: 30,
      width: '80%'
  }
});

export default AdminDashboardScreen;
