import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
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
  if (token) {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "All Lines") {
              iconName = "library";
            } else {
              iconName = "log-out";
            }

            return (
              <View
                style={{
                  backgroundColor: focused ? "#f2f2f2" : "transparent",
                  borderRadius: 16,
                  // padding: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={iconName} size={24} color={color} />
              </View>
            );
          },
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 14, // bigger text
            fontWeight: "600",
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
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <MyTabs />
    </View>
  );
};

export default AppHome;
