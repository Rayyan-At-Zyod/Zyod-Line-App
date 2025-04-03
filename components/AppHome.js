import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Stack1 from "./Stack1";
import Stack2 from "./Stack2";
import Home from "./Home";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "All Lines") {
            iconName = focused ? "library" : "library-outline";
          } else {
            iconName = focused ? "log-out" : "log-out-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
          // return <Ionicons name="library" size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="All Lines"
        component={Stack1}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity {...props} disabled={true} />
          ),
        }}
      />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="Logout"
        component={Stack2}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity {...props} disabled={true} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const AppHome = () => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <MyTabs />
    </View>
  );
};

export default AppHome;
