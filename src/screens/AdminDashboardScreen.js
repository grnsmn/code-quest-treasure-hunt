import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { auth } from "../config/firebaseConfig";

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.navigate("Register");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("admin.dashboard.title")}</Text>
      <Text>{t("admin.dashboard.welcome")}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={t("admin.dashboard.manageQuestions")}
          onPress={() => navigation.navigate("ManageQuestions")}
        />
        <View style={{ height: 10 }} />
        <Button
          title={t("admin.dashboard.viewUsers")}
          onPress={() => navigation.navigate("ViewUsers")}
        />
        <View style={{ height: 20 }} />
        <Button
          title={t("admin.dashboard.logout")}
          onPress={handleLogout}
          color="red"
        />
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 30,
    width: "80%",
  },
});

export default AdminDashboardScreen;
