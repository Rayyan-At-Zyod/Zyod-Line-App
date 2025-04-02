import React, { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button, Menu } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function HomeStart() {
  const navigation = useNavigation();
  const [noOfOps, setNoOfOps] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectedLine, setSelectedLine] = useState("Select Line");

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const selectLine = (line) => {
    setSelectedLine(line);
    closeMenu();
  };

  // ----- CUSTOM HEADER -----
  useLayoutEffect(() => {
    navigation.setOptions({
      // 1) Custom Title (Left side, keeps back button)
      headerTitle: () => (
        <View style={{ flexDirection: "column" }}>
          {/* The top line: e.g. "Line - 01 | Operators: 5" */}
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Line Incharge: Satish (in session)
          </Text>
          {/* The second line: e.g. "Line Incharge: Satish (in session)" */}
          <Text style={{ fontSize: 12, color: "#333" }}>
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
      ),

      // 2) Right side: e.g. "English" + date
      headerRight: () => (
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Text style={{ fontSize: 12 }}>English</Text>
          <Text></Text>
        </View>
      ),

      // (Optional) Align the custom title in the center or left
      headerTitleAlign: "center",
    });
  }, [navigation, noOfOps]);

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Choose Line Number</Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button mode="outlined" onPress={openMenu}>
              {selectedLine}
            </Button>
          }
        >
          <Menu.Item onPress={() => selectLine("Line 1")} title="Line 1" />
          <Menu.Item onPress={() => selectLine("Line 2")} title="Line 2" />
          <Menu.Item onPress={() => selectLine("Line 3")} title="Line 3" />
        </Menu>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Enter Number of Operators</Text>
        <TextInput
          style={styles.textInput}
          label="Number of Operators"
          mode="outlined"
          keyboardType="number-pad"
          value={noOfOps}
          onChangeText={setNoOfOps}
        />
      </View>
      <Button
        mode="contained"
        onPress={() =>
          navigation.navigate("Home Scanner", { line: selectedLine, noOfOps })
        }
        style={styles.button}
      >
        Start Scanning Bundles
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  textInput: {
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
  },
});
