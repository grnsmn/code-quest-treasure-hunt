import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { auth, db } from "../config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AdminLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const checkAdminRoleAndNavigate = async (user) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().role === "admin") {
      Alert.alert(t("common.success"), t("admin.login.successMessage"));
      navigation.navigate("AdminDashboard");
    } else {
      Alert.alert(
        t("admin.login.accessDeniedTitle"),
        t("admin.login.accessDeniedMessage")
      );
      auth.signOut();
    }
  };

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert(t("common.error"), t("admin.login.missingFields"));
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await checkAdminRoleAndNavigate(userCredential.user);
    } catch (error) {
      Alert.alert(t("admin.login.loginErrorTitle"), error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (email === "" || password === "") {
      Alert.alert(t("common.error"), t("admin.login.missingFields"));
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        username: email.split("@")[0],
        email: email,
      });

      Alert.alert(
        t("admin.login.accountCreatedTitle"),
        t("admin.login.accountCreatedMessage")
      );
    } catch (error) {
      Alert.alert(t("admin.login.creationErrorTitle"), error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("admin.login.title")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("admin.login.emailPlaceholder")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={t("admin.login.passwordPlaceholder")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title={t("admin.login.loginButton")} onPress={handleLogin} />
          <View style={styles.separator} />
          <Button
            title={t("admin.login.createButton")}
            onPress={handleCreateAccount}
            color="#841584"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  separator: {
    height: 10,
  },
});

export default AdminLoginScreen;
