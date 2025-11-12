import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const EndScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { redemptionCode } = route.params || {};

  const handlePlayAgain = () => {
    // Reset the navigation stack to the Register screen
    navigation.reset({
      index: 0,
      routes: [{ name: "Register" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COMPLETATO!</Text>
      <Text style={styles.subtitle}>Missione Riuscita!</Text>
      {redemptionCode && (
        <>
          <Text style={styles.redemptionCodeLabel}>Codice di Riscossione:</Text>
          <Text style={styles.redemptionCode}>{redemptionCode}</Text>
          <Text style={styles.instructions}>
            Mostra questa schermata e il codice al Desk Premi per ritirare il
            tuo Portachiavi Ufficiale della DevFest Challenge!
          </Text>
        </>
      )}
      <View style={styles.buttonContainer}>
        <Button title='Gioca di Nuovo' onPress={handlePlayAgain} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#e3f2fd", // Light blue background
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0d47a1", // Dark blue text
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24, // Slightly larger for "Missione Riuscita!"
    color: "#1565c0", // Medium blue text
    textAlign: "center",
    marginBottom: 30,
  },
  redemptionCodeLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
  },
  redemptionCode: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d32f2f", // Red color for emphasis
    textAlign: "center",
    marginBottom: 30,
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 10,
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "80%",
  },
});

export default EndScreen;
