import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

const EndScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { redemptionCode } = route.params || {};

  const handlePlayAgain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Register" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("end.title")}</Text>
      <Text style={styles.subtitle}>{t("end.completedGame")}</Text>
      {redemptionCode && (
        <>
          <Text style={styles.redemptionCodeLabel}>
            {t("end.redemptionCode")}
          </Text>
          <Text style={styles.redemptionCode}>{redemptionCode}</Text>
          <Text style={styles.instructions}>{t("end.instructions")}</Text>
        </>
      )}

      <View>
        <LottieView
          source={require("../../assets/lottie/Champion.json")}
          autoPlay
          loop={true}
          style={styles.lottieAnimation}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title={t("end.playAgain")} onPress={handlePlayAgain} />
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
    backgroundColor: "#e3f2fd",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0d47a1",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: "#1565c0",
    textAlign: "center",
    marginBottom: 30,
  },
  lottieAnimation: {
    width: 50,
    height: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#0d47a1",
    borderRadius: 25,
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
    color: "#d32f2f",
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
