import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { db } from "../config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import LottieView from "lottie-react-native";

const SuccessScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, questionData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Risposta Corretta!</Text>
      <View>
        <LottieView
          source={require("../../assets/lottie/LocationFinding.json")} // User needs to provide this file
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>
      <Text style={styles.clueHeader}>Ecco il tuo prossimo indizio:</Text>
      <Text style={styles.clueText}>{questionData.correctResponseText}</Text>
      <View style={styles.buttonContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#e8f5e9", // A light green background
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32", // Dark green text
    marginBottom: 20,
  },
  clueHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  clueText: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 15,
    fontStyle: "italic",
  },
  buttonContainer: {
    marginTop: 40,
    width: "80%",
  },
});

export default SuccessScreen;
