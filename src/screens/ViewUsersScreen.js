import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const ViewUsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users: ", error);
      Alert.alert("Errore", "Impossibile caricare la lista utenti. Controlla le regole di sicurezza.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.username}>{item.username || 'N/A'}</Text>
      <Text>Email: {item.email || 'N/A'}</Text>
      <Text>Domanda Corrente: {item.currentQuestionOrder || 'N/A'}</Text>
      <Text style={styles.role}>Ruolo: {item.role || 'Giocatore'}</Text>
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      style={styles.list}
      ListHeaderComponent={<Text style={styles.header}>Lista Partecipanti</Text>}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  role: {
    fontStyle: 'italic',
    color: 'gray',
    marginTop: 5,
  }
});

export default ViewUsersScreen;
