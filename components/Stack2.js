import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";

const Stack2 = () => {
    const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text>Stack2</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Stack2;
