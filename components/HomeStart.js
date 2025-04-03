import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { TextInput, Button, Menu, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import homeStartStyles from "../styles/HomeStart.styles";

export default function HomeStart() {
  const navigation = useNavigation();
  const [noOfOps, setNoOfOps] = useState("");
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
      const response = await fetch("https://dev-api.zyod.com/v1/lines/list/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOjQxODcsInBvcnRhbCI6Ilp5b2QiLCJjcmVhdGVkQXQiOiIyMDI1LTA0LTAxVDEyOjI1OjI2Ljg4NloifSwiaWF0IjoxNzQzNTEwMzI2LCJleHAiOjE3NDQxMTUxMjZ9.mQnAwdNzuRhGWF3Hio3zceZNX_R1fNDQ7FwG2cFSRg0`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch lines");
      }

      // Sort lines by LineId in ascending order
      const sortedLines = data.data.rows.sort((a, b) => a.LineId - b.LineId);
      setLines(sortedLines);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching lines:", err);
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

  // ----- CUSTOM HEADER (no changes here) -----
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Line Incharge: Satish (in session)
          </Text>
          <Text style={{ fontSize: 12, color: "#333" }}>
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Text style={{ fontSize: 12 }}>English</Text>
          <Text></Text>
        </View>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation, noOfOps]);

  return (
    <View style={homeStartStyles.container}>
      {/* Card-like container for the form */}
      <View style={homeStartStyles.card}>
        <View style={homeStartStyles.inputGroup}>
          <Text style={homeStartStyles.label}>Choose Line No.</Text>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Button
                mode="outlined"
                onPress={openMenu}
                icon="chevron-down"
                style={homeStartStyles.dropdownButton}
                labelStyle={homeStartStyles.dropdownButtonLabel}
                contentStyle={homeStartStyles.dropdownButtonContent}
              >
                {selectedLine}
              </Button>
            }
          >
            {loading ? (
              <View style={homeStartStyles.loadingContainer}>
                <ActivityIndicator size="small" />
              </View>
            ) : error ? (
              <Text style={homeStartStyles.errorText}>{error}</Text>
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

        <View style={homeStartStyles.inputGroup}>
          <Text style={homeStartStyles.label}>Enter No. of Operators</Text>
          <TextInput
            style={homeStartStyles.textInput}
            label="Number of Operators"
            mode="outlined"
            keyboardType="number-pad"
            value={noOfOps}
            onChangeText={setNoOfOps}
            onSubmitEditing={() => {
              if (selectedLine === "Select Line" || !noOfOps) {
                return;
              }
              navigation.navigate("Home Scanner", {
                line: selectedLine,
                noOfOps,
                lineId: lines.find((l) => `Line ${l.LineId}` === selectedLine)
                  ?.LineId,
              });
            }}
          />
        </View>

        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("Home Scanner", {
              line: selectedLine,
              noOfOps,
              lineId: lines.find((l) => `Line ${l.LineId}` === selectedLine)
                ?.LineId,
            })
          }
          style={
            selectedLine === "Select Line" || !noOfOps
              ? homeStartStyles.disabledButton
              : homeStartStyles.button
          }
          labelStyle={homeStartStyles.buttonLabel}
          disabled={selectedLine === "Select Line" || !noOfOps}
        >
          <Text
            style={
              selectedLine === "Select Line" || !noOfOps
                ? homeStartStyles.disabledButtonText
                : homeStartStyles.buttonText
            }
          >
            Start Scanning Bundles
          </Text>
        </Button>
      </View>
    </View>
  );
}
