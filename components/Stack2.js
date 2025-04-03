import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";

const Stack2 = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        margin: 100,
      }}
    >
      <Text>Hey Rayyan</Text>
      <Text>Are you sure you wanna log out??</Text>
      {/* <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text>Go to Profile</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Stack2;
