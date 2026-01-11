import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

import RegisterScreen from "../screens/RegisterScreen";
import QuestionScreen from "../screens/QuestionScreen";
import SuccessScreen from "../screens/SuccessScreen";
import EndScreen from "../screens/EndScreen";
import AdminLoginScreen from "../screens/AdminLoginScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import ViewUsersScreen from "../screens/ViewUsersScreen";
import ManageQuestionsScreen from "../screens/ManageQuestionsScreen";

const Stack = createStackNavigator();
const prefixes = __DEV__
  ? ["http://localhost:8081"]
  : ["https://code-quest-treasure-hunt.netlify.app"];

const linking = {
  prefixes: prefixes,
  config: {
    screens: {
      Register: "register",
      Question: "question/:questionId",
    },
  },
};

const AppNavigator = () => {
  const { t } = useTranslation();

  return (
    <NavigationContainer
      linking={linking}
      fallback={<Text>{t("app.loading")}</Text>}
    >
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: t("register.title") }}
        />
        <Stack.Screen
          name="Question"
          component={QuestionScreen}
          options={{ title: t("question.title") }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="End"
          component={EndScreen}
          options={{ title: t("end.title") }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ title: t("admin.login.title") }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{ title: t("admin.dashboard.title") }}
        />
        <Stack.Screen
          name="ViewUsers"
          component={ViewUsersScreen}
          options={{ title: t("admin.viewUsers.title") }}
        />
        <Stack.Screen
          name="ManageQuestions"
          component={ManageQuestionsScreen}
          options={{ title: t("admin.dashboard.manageQuestions") }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
