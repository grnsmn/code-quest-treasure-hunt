import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db, auth } from "../config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import LottieView from "lottie-react-native";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { nextScreen, questionId } = route.params || {};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      try {
        if (authenticatedUser) {
          setUser(authenticatedUser);

          if (authenticatedUser.isAnonymous) {
            const userDocRef = doc(db, "users", authenticatedUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              setUsername(userDoc.data().username);
            }
          }
          setIsLoading(false);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Authentication process failed:", error);
        Alert.alert(
          "Errore di Autenticazione",
          "Impossibile connettersi ai servizi."
        );
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleStartGame = async () => {
    if (!user) {
      Alert.alert(
        "Autenticazione in corso",
        "Per favore attendi un momento e riprova."
      );
      return;
    }
    if (username.trim() === "") {
      Alert.alert(
        "Username richiesto",
        "Per favore, inserisci un username per iniziare."
      );
      return;
    }

    setIsLoading(true);
    const userDocRef = doc(db, "users", user.uid);

    try {
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        const newUserProfile = {
          username: username.trim(),
          currentQuestionOrder: 1,
        };
        await setDoc(userDocRef, newUserProfile);
        Alert.alert(
          "Benvenuto!",
          `Il tuo profilo è stato creato, ${username}.`
        );
      }

      if (nextScreen) {
        navigation.navigate(nextScreen, {
          userId: user.uid,
          questionId: questionId,
        });
      } else {
        navigation.navigate("Question", { userId: user.uid, questionId: 1 });
      }
    } catch (error) {
      console.error("Error starting game: ", error);
      Alert.alert(
        "Errore",
        "Impossibile avviare il gioco. Controlla la tua connessione."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#0000ff' />
        {/* Lottie Animation */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Caccia al Tesoro</Text>
        <View>
          <LottieView
            source={require("../../assets/lottie/TreasureBox.json")} // User needs to provide this file
            autoPlay
            loop={true} // Play once for completion
            style={styles.lottieAnimation}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder='Inserisci il tuo username'
          value={username}
          onChangeText={setUsername}
          autoCapitalize='none'
        />
        <Button title='Inizia o Continua il Gioco' onPress={handleStartGame} />
      </View>
      <TouchableOpacity
        style={styles.adminButton}
        onPress={() => navigation.navigate("AdminLogin")}
      >
        <Text style={styles.adminButtonText}>Sei un Admin?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  adminButton: {
    padding: 10,
    marginBottom: 20,
  },
  adminButtonText: {
    fontSize: 14,
    color: "gray",
    textDecorationLine: "underline",
  },
  lottieAnimation: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default RegisterScreen;
