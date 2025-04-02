import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Top1 from "./Top1";
import Top2 from "./Top2";

const Tab = createMaterialTopTabNavigator();

function MyTopTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Rayyan1" component={Top1} />
      <Tab.Screen name="Rayyan2" component={Top2} />
    </Tab.Navigator>
  );
}
const Stack1 = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <MyTopTabs />
    </View>
  );
};

export default Stack1;
