import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

const SuccessScreen = () => {
  const route = useRoute();
  const { t } = useTranslation();
  const { questionData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("success.correctAnswer")}</Text>
      <Text style={styles.prepareCameraText}>{t("success.prepareCamera")}</Text>
      <View>
        <LottieView
          source={require("../../assets/lottie/LocationFinding.json")}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>
      <Text style={styles.clueHeader}>{t("success.clueHeader")}</Text>
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
    backgroundColor: "#e8f5e9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 20,
  },
  lottieAnimation: {
    width: 150,
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
    marginBottom: 20,
  },
  prepareCameraText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginHorizontal: 15,
    marginBottom: 30,
    color: "#ec6464ff",
  },
  buttonContainer: {
    marginTop: 40,
    width: "80%",
  },
});

export default SuccessScreen;
