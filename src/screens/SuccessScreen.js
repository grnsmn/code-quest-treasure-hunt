import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
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
      <Text style={styles.prepareCameraText}>
        Tieni pronta la tua fotocamera: il prossimo indizio è nascosto in un
        nuovo QR Code!
      </Text>
      <View>
        <LottieView
          source={require("../../assets/lottie/LocationFinding.json")}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>
      <Text style={styles.clueHeader}>Indizio per il prossimo QR Code:</Text>
      <Text style={styles.clueText}>{questionData.correctResponseText}</Text>
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
  lottieAnimation: {
    width: 150, // Adjust size as needed
    height: 150,
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
    marginBottom: 20, // Added margin for separation
  },
  prepareCameraText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 15,
    marginBottom: 30, // Increased margin for emphasis
    color: "#ec6464ff",
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 40,
    width: "80%",
  },
});

export default SuccessScreen;
