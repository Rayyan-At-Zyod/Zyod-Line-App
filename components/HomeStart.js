import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { TextInput, Button, Menu, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import homeStartStyles from "../styles/HomeStart.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

export default function HomeStart() {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [noOfOps, setNoOfOps] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedLine, setSelectedLine] = useState("Select Line");
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const noOfOpsRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLines();
    getFirstName();
  }, []);

  const getFirstName = async () => {
    const name = await AsyncStorage.getItem("userFirstName");
    setFirstName(name || "");
  };

  const fetchLines = async () => {
    try {
      const response = await fetch(
        "https://dev-api.zyod.com/v1/lines/list/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch lines");
      }

      // Sort lines by LineId in ascending order
      const sortedLines = data.data.rows.sort((a, b) => a.LineId - b.LineId);
      setLines(sortedLines);
      console.log(">>lines\n", sortedLines);
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
    setTimeout(() => {
      noOfOpsRef.current?.focus();
    }, 100); // Slight delay to ensure UI is ready
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Line Incharge: {firstName} (in session)
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
      headerTitleAlign: "center",
    });
  }, [navigation, firstName]);

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
            style={{ marginTop: 50 }}
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
                  style={{ minHeight: 40 }}
                />
              ))
            )}
          </Menu>
        </View>

        <View style={homeStartStyles.inputGroup}>
          <Text style={homeStartStyles.label}>Enter No. of Operators</Text>
          <TextInput
            ref={noOfOpsRef}
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
