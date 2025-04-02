import React, { useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  Button,
  List,
  TextInput,
  IconButton,
  Snackbar,
} from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScanner() {
  const route = useRoute();
  const navigation = useNavigation();
  const { line, noOfOps, lineId } = route.params || {};
  const [barcode, setBarcode] = useState("");
  const [scannedItems, setScannedItems] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const [allocating, setAllocating] = useState(false);

  // ----- CUSTOM HEADER -----
  useLayoutEffect(() => {
    navigation.setOptions({
      // 1) Custom Title (Left side, keeps back button)
      headerTitle: () => (
        <View style={{ flexDirection: "column" }}>
          {/* The top line: e.g. "Line - 01 | Operators: 5" */}
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {line && noOfOps
              ? `Line - ${line.replace(/\D+/g, "")} | Operators: ${noOfOps}`
              : "No Line Selected | Operators: -"}
          </Text>
          {/* The second line: e.g. "Line Incharge: Satish (in session)" */}
          <Text style={{ fontSize: 12, color: "#333" }}>
            Line Incharge: Satish (in session)
          </Text>
        </View>
      ),

      // 2) Right side: e.g. "English" + date
      headerRight: () => (
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Text style={{ fontSize: 12 }}>English</Text>
          <Text style={{ fontSize: 12 }}>
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
      ),

      // (Optional) Align the custom title in the center or left
      headerTitleAlign: "center",
    });
  }, [navigation, line, noOfOps]);

  const showSnackbar = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 5000);
  };

  const handleBarcodeSubmit = async () => {
    console.log("handle barcode submit");
    try {
      const apiBarcode = barcode.toString();
      const response = await fetch(
        `https://dev-api.zyod.com/v1/barcodes/batchDetailsFromBarcode?barcode=${apiBarcode}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOjQxODcsInBvcnRhbCI6Ilp5b2QiLCJjcmVhdGVkQXQiOiIyMDI1LTA0LTAxVDEyOjI1OjI2Ljg4NloifSwiaWF0IjoxNzQzNTEwMzI2LCJleHAiOjE3NDQxMTUxMjZ9.mQnAwdNzuRhGWF3Hio3zceZNX_R1fNDQ7FwG2cFSRg0`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Failed to add raw material";
        throw new Error(errorMessage);
      }

      // Check if item already exists
      const isDuplicate = scannedItems.some(
        (item) => item.size === data.data.batchDetails.skuCode
      );

      if (isDuplicate) {
        showSnackbar(
          `${data.data.batchDetails.skuCode} is already scanned`,
          "error"
        );
        return;
      }

      // Add the scanned item to the list with all necessary data
      const newItem = {
        id: Date.now(),
        size: data.data.batchDetails.skuCode,
        serials: data.data.batchDetails.serials,
        totalQuantity: data.data.batchDetails.quantity,
        barcode: data.data.barcode,
        sku: data.data.batchDetails.skuCode,
        brand: data.data.batchDetails.skuType,
        poSku: data.data.batchDetails.skuCode,
        allocationTime: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      };

      setScannedItems((prevItems) => [...prevItems, newItem]);
      setBarcode(""); // Clear the input after successful scan
      showSnackbar(
        `${data.data.batchDetails.skuCode} scanned successfully`,
        "success"
      );
    } catch (error) {
      console.log(`Error: ${error}`);
      throw error;
    }
  };

  const handleAllocateBundles = async () => {
    if (scannedItems.length === 0) {
      showSnackbar("No bundles to allocate", "error");
      return;
    }

    setAllocating(true);
    try {
      const allocationsData = scannedItems.map((item) => ({
        noOfOperator: parseInt(noOfOps),
        size: item.size,
        qty: item.totalQuantity,
        barcode: item.barcode,
        brand: item.brand,
        sku: item.sku,
        poSku: item.poSku,
        allocationTime: item.allocationTime,
      }));

      console.log("allocating data:\n", allocationsData);

      const response = await fetch(
        "https://dev-api.zyod.com/v1/lines/allocations/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOjQxODcsInBvcnRhbCI6Ilp5b2QiLCJjcmVhdGVkQXQiOiIyMDI1LTA0LTAxVDEyOjI1OjI2Ljg4NloifSwiaWF0IjoxNzQzNTEwMzI2LCJleHAiOjE3NDQxMTUxMjZ9.mQnAwdNzuRhGWF3Hio3zceZNX_R1fNDQ7FwG2cFSRg0`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lineId: lineId,
            allocationsData: allocationsData,
          }),
        }
      );

      const data = await response.json();

      console.log(JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(data.message || "Failed to allocate bundles");
      }

      showSnackbar(
        `${scannedItems.length} bundles allocated successfully`,
        "success"
      );
      setScannedItems([]); // Clear the table after successful allocation
    } catch (error) {
      console.error("Error allocating bundles:", error);
      showSnackbar(error.message || "Failed to allocate bundles", "error");
    } finally {
      setAllocating(false);
    }
  };

  const handleDeleteItem = (id) => {
    setScannedItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, { flex: 0.5 }]}>S.No.</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Size</Text>
      <Text style={[styles.headerCell, { flex: 1.5 }]}>Serials</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Total Quantity</Text>
      <Text style={[styles.headerCell, { flex: 0.5 }]}>Action</Text>
    </View>
  );

  const renderTableRow = (item, index) => (
    <View key={item.id} style={styles.tableRow}>
      <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.size}</Text>
      <Text style={[styles.cell, { flex: 1.5 }]}>
        {item.serials.length > 0 ? item.serials.join(", ") : "-"}
      </Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.totalQuantity}</Text>
      <View style={[styles.cell, { flex: 0.5 }]}>
        <IconButton
          icon="delete"
          size={20}
          onPress={() => handleDeleteItem(item.id)}
          iconColor="#FF0000"
        />
      </View>
    </View>
  );

  const handleScan = () => {
    console.log("handle scan");
    handleBarcodeSubmit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.scanInputContainer}>
        <List.Subheader>Scan or enter bundle code</List.Subheader>
        <View style={styles.scanRow}>
          <View style={styles.scanBox}>
            <TextInput
              style={styles.codeText}
              label="Number of Operators"
              mode="outlined"
              keyboardType="number-pad"
              value={barcode}
              onChangeText={setBarcode}
              onSubmitEditing={handleBarcodeSubmit}
            />
          </View>
          <Ionicons
            name="camera"
            size={28}
            style={styles.scanIcon}
            onPress={handleScan}
          />
        </View>
      </View>

      {/* Table Section */}
      <View style={styles.tableWrapper}>
        {scannedItems.length > 0 && renderTableHeader()}
        <ScrollView style={styles.tableContainer}>
          {scannedItems.map((item, index) => renderTableRow(item, index))}
        </ScrollView>
      </View>

      {/* Allocate Button */}
      {scannedItems.length > 0 && (
        <Button
          mode="contained"
          onPress={handleAllocateBundles}
          style={styles.allocateButton}
          loading={allocating}
          disabled={allocating}
        >
          Allocate Bundles
        </Button>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}
        style={[
          styles.snackbar,
          {
            backgroundColor: snackbarType === "success" ? "#4CAF50" : "#FF5252",
          },
        ]}
      >
        <Text
          style={[
            styles.snackbarText,
            { color: snackbarType === "success" ? "#FFFFFF" : "#FFFFFF" },
          ]}
        >
          {snackbarMessage}
        </Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  scanInputContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  scanRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  scanBox: {
    flex: 0.9,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  codeText: {
    fontSize: 14,
  },
  scanIcon: {
    marginLeft: 10,
    color: "#333",
  },
  tableWrapper: {
    flexGrow: 0,
    marginBottom: 20,
  },
  tableContainer: {
    maxHeight: 300, // Adjust this value as needed
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  cell: {
    fontSize: 14,
    color: "#333",
  },
  allocateButton: {
    marginVertical: 20,
  },
  snackbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  snackbarText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
