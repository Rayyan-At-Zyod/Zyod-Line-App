import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";

const Profile = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text>Profile</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text>Go to Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Stack1")}>
        <Text>Go to Stack1</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Stack2")}>
        <Text>Go to Stack2</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
