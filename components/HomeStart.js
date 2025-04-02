import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button, Menu, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function HomeStart() {
  const navigation = useNavigation();
  const [noOfOps, setNoOfOps] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectedLine, setSelectedLine] = useState("Select Line");
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLines();
  }, []);

  const fetchLines = async () => {
    try {
      const response = await fetch('https://dev-api.zyod.com/v1/lines/list/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOjQxODcsInBvcnRhbCI6Ilp5b2QiLCJjcmVhdGVkQXQiOiIyMDI1LTA0LTAxVDEyOjI1OjI2Ljg4NloifSwiaWF0IjoxNzQzNTEwMzI2LCJleHAiOjE3NDQxMTUxMjZ9.mQnAwdNzuRhGWF3Hio3zceZNX_R1fNDQ7FwG2cFSRg0`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch lines');
      }

      // Sort lines by LineId in ascending order
      const sortedLines = data.data.rows.sort((a, b) => a.LineId - b.LineId);
      setLines(sortedLines);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching lines:', err);
    } finally {
      setLoading(false);
    }
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const selectLine = (line) => {
    setSelectedLine(`Line ${line.LineId}`);
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" />
            </View>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            lines.map((line) => (
              <Menu.Item
                key={line.LineId}
                onPress={() => selectLine(line)}
                title={`Line ${line.LineId}`}
              />
            ))
          )}
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
          navigation.navigate("Home Scanner", { 
            line: selectedLine, 
            noOfOps,
            lineId: lines.find(l => `Line ${l.LineId}` === selectedLine)?.LineId 
          })
        }
        style={styles.button}
        disabled={selectedLine === "Select Line" || !noOfOps}
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
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    padding: 10,
    textAlign: 'center',
  },
});
