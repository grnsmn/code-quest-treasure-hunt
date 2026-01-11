import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, i18n.language === "it" && styles.activeButton]}
        onPress={() => changeLanguage("it")}
      >
        <Text style={styles.buttonText}>{t("common.languageItalian")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, i18n.language === "en" && styles.activeButton]}
        onPress={() => changeLanguage("en")}
      >
        <Text style={styles.buttonText}>{t("common.languageEnglish")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  button: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  activeButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LanguageSwitcher;
