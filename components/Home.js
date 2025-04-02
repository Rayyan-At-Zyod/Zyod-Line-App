import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Stack1 from "./Stack1";
import Stack2 from "./Stack2";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Stack1" component={Stack1} />
      <Tab.Screen name="Stack2" component={Stack2} />
    </Tab.Navigator>
  );
}

const Home = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text>Home</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Stack1")}>
        <Text>Go to Stack1</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Stack2")}>
        <Text>Go to Stack2</Text>
      </TouchableOpacity>
      <MyTabs/>
    </View>
  );
};

export default Home;
