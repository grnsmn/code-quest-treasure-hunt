import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import RegisterScreen from '../screens/RegisterScreen';
import QuestionScreen from '../screens/QuestionScreen';
import SuccessScreen from '../screens/SuccessScreen';
import UnlockScreen from '../screens/UnlockScreen';
import EndScreen from '../screens/EndScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ViewUsersScreen from '../screens/ViewUsersScreen';
import ManageQuestionsScreen from '../screens/ManageQuestionsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Gioca' }} />
        <Stack.Screen name="Question" component={QuestionScreen} options={{ title: 'Domanda' }} />
        <Stack.Screen name="Success" component={SuccessScreen} options={{ title: 'Risposta Corretta!' }} />
        <Stack.Screen name="Unlock" component={UnlockScreen} options={{ title: 'Sblocca Domanda' }} />
        <Stack.Screen name="End" component={EndScreen} options={{ title: 'Fine del Gioco' }} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: 'Accesso Admin' }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Pannello Admin' }} />
        <Stack.Screen name="ViewUsers" component={ViewUsersScreen} options={{ title: 'Lista Utenti' }} />
        <Stack.Screen name="ManageQuestions" component={ManageQuestionsScreen} options={{ title: 'Gestione Domande' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
