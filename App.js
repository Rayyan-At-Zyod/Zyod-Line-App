import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import MyStack from "./components/MyStack";

export default function App() {
  return (
      <NavigationContainer>
        <MyStack />
        <StatusBar style="auto" />
      </NavigationContainer>
  );
}

