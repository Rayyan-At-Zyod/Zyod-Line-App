import React from "react";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeStart from "./HomeStart";
import HomeScanner from "./HomeScanner";

const Stack = createNativeStackNavigator();

function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home Start" component={HomeStart} />
      <Stack.Screen name="Home Scanner" component={HomeScanner} />
    </Stack.Navigator>
  );
}

export default Home;
