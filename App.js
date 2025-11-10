import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

// Suppress a specific warning about non-serializable values in navigation state.
// This is common in development when passing complex objects or functions,
// but should be addressed in production for state persistence to work correctly.
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);


export default function App() {
  return <AppNavigator />;
}
