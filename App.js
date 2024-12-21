import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import { API_BASE_URL } from "@env";

export default function App() {
  console.log("API Base URL:", API_BASE_URL);
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
