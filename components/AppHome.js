import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Stack1 from "./Stack1";
import LogoutScreen from "./Logout";
import Home from "./Home";
import { useAuth } from "../context/AuthContext";
import SignInScreen from "../auth/SignInScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyTabs() {
  const { token } = useAuth();

  console.log("token", token);

  if (token) {
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
          component={LogoutScreen}
          // options={{
          //   tabBarButton: (props) => (
          //     <TouchableOpacity {...props} disabled={true} />
          //   ),
          // }}
        />
      </Tab.Navigator>
    );
  } else {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
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
