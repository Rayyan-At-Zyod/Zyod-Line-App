import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  Button,
  List,
  TextInput,
  IconButton,
  Snackbar,
} from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { homeScannerStyles } from "../styles/HomeScanner.styles";
import BarCodeScannerModal from "./BarCodeScannerModal";

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
  const [showScanner, setShowScanner] = useState(false);
  const [allocated, setAllocated] = useState(false);

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

  const handleAllocateBundles = async () => {
    if (scannedItems.length === 0) {
      showSnackbar("No bundles to allocate", "error");
      return;
    }

    setAllocating(true);
    try {
      const allocationsData = scannedItems.map((item) => {
        console.log(JSON.stringify(item, null, 2));
        return {
          noOfOperator: parseInt(noOfOps),
          size: item.size,
          qty: item.totalQuantity,
          barcode: item.barcode,
          brand: item.brand,
          sku: item.sku,
          poSku: item.poSku,
          // allocationTime: item.allocationTime,
          serials: item.serials.length > 0 ? item.serials.join("-") : "1-10",
        };
      });

      console.log(
        "allocating data:\n",
        JSON.stringify(allocationsData, null, 2)
      );

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
      //   setScannedItems([]); // Clear the table after successful allocation
    } catch (error) {
      console.error("Error allocating bundles:", error);
      showSnackbar(error.message || "Failed to allocate bundles", "error");
    } finally {
      setAllocating(false);
      setAllocated(true);
    }
  };

  const handleDeleteItem = (id) => {
    setScannedItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const renderTableHeader = () => (
    <View style={homeScannerStyles.tableHeader}>
      <Text style={[homeScannerStyles.headerCell, { flex: 0.5 }]}>S.No.</Text>
      <Text style={[homeScannerStyles.headerCell, { flex: 1 }]}>Size</Text>
      <Text style={[homeScannerStyles.headerCell, { flex: 1.5 }]}>Serials</Text>
      <Text style={[homeScannerStyles.headerCell, { flex: 1 }]}>
        Total Quantity
      </Text>
      <Text style={[homeScannerStyles.headerCell, { flex: 0.5 }]}>Action</Text>
    </View>
  );

  const renderTableRow = (item, index) => (
    <View key={item.id} style={homeScannerStyles.tableRow}>
      <Text style={[homeScannerStyles.cell, { flex: 0.5 }]}>{index + 1}</Text>
      <Text style={[homeScannerStyles.cell, { flex: 1 }]}>{item.size}</Text>
      <Text style={[homeScannerStyles.cell, { flex: 1.5 }]}>
        {item.serials.length > 0 ? item.serials.join(", ") : "1 - 10"}
      </Text>
      <Text style={[homeScannerStyles.cell, { flex: 1 }]}>
        {item.totalQuantity}
      </Text>
      <View style={[homeScannerStyles.cell, { flex: 0.5 }]}>
        <IconButton
          icon="delete"
          size={20}
          onPress={() => handleDeleteItem(item.id)}
          iconColor="#FF0000"
        />
      </View>
    </View>
  );

  const handleBarcodeSubmit = async (scannedBarcode = null) => {
    console.log("handle barcode submit");
    try {
      const apiBarcode = (scannedBarcode || barcode).toString();
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
        (item) => item.id === data.data.barcode
      );

      if (isDuplicate) {
        showSnackbar(
          `${data.data.batchDetails.skuCode} is already scanned`,
          "error"
        );
        return;
      }

      let size;
      if (data.data.barcodeType == "BUNDLE") {
        size = data?.data?.batchDetails?.bundles?.find(
          (item) => item.barcode === data.data.barcode
        )?.size;
      } else {
        data?.data?.batchDetails?.bundles?.forEach((bundle) =>
          bundle.serials?.forEach((item) => {
            if (item.barcode === data.data.barcode) {
              size = item.size;
            }
          })
        );
      }

      console.log(">>---------- size:", size);

      // Add the scanned item to the list with all necessary data
      const newItem = {
        id: data.data.barcode,
        size: size,
        serials: data.data.batchDetails.serials,
        // serials: [1, 10],
        totalQuantity: data.data.remainingQuantity,
        brand: data.data.brandName,
        barcode: data.data.barcode,
        sku: data.data.batchDetails.skuCode,
        poSku: data.data.batchDetails.metadata.finishedGoodDetails.code, // ?
        // allocationTime: new Date(),
      };

      setScannedItems((prevItems) => [...prevItems, newItem]);
      setBarcode(""); // Clear the input after successful scan
      showSnackbar(
        `${data.data.batchDetails.skuCode} scanned successfully`,
        "success"
      );
    } catch (error) {
      console.log(`Error: ${error}`);
      showSnackbar(error.message || "Failed to scan barcode", "error");
    }
  };

  const handleScanButtonPress = () => {
    console.log("scanner pressed.");
    setShowScanner(true);
  };

  const handleBarcodeScanned = (scannedValue) => {
    handleBarcodeSubmit(scannedValue);
  };

  return (
    <View style={homeScannerStyles.container}>
      {/* scan input container */}
      <View style={homeScannerStyles.scanInputContainer}>
        <List.Subheader>Enter bundle code</List.Subheader>
        <View style={homeScannerStyles.scanRow}>
          <View style={homeScannerStyles.scanBox}>
            <TextInput
              style={homeScannerStyles.codeText}
              label="Enter bundle code"
              mode="outlined"
              keyboardType="number-pad"
              value={barcode}
              onChangeText={setBarcode}
              onSubmitEditing={() => handleBarcodeSubmit()}
            />
          </View>
          <View style={homeScannerStyles.scanCameraBox}>
            <TouchableOpacity onPress={handleScanButtonPress}>
              <Ionicons name="camera-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Table Section */}
      <View style={homeScannerStyles.tableWrapper}>
        {scannedItems.length > 0 && renderTableHeader()}
        <ScrollView style={homeScannerStyles.tableContainer}>
          {scannedItems.map((item, index) => renderTableRow(item, index))}
        </ScrollView>
      </View>

      {/* Allocate Button */}
      {scannedItems.length > 0 && !allocated && (
        <View style={homeScannerStyles.buttonView}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Home Start")}
            style={homeScannerStyles.cancelButton}
            loading={allocating}
            disabled={allocating}
          >
            <Text style={homeScannerStyles.cancelButtonText}>Cancel</Text>
          </Button>
          <Button
            mode="contained"
            onPress={handleAllocateBundles}
            style={homeScannerStyles.allocateButton}
            loading={allocating}
            disabled={allocating}
          >
            Allocate Bundles
          </Button>
        </View>
      )}

      {/* Allocate Button */}
      {scannedItems.length > 0 && allocated && (
        <View style={homeScannerStyles.buttonView}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Home Start")}
            style={homeScannerStyles.newAllocationButton}
            loading={allocating}
            disabled={allocating}
          >
            <Text style={homeScannerStyles.newAllocationButtonText}>
              + New Allocation
            </Text>
          </Button>
        </View>
      )}

      <BarCodeScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onBarCodeScanned={handleBarcodeScanned}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}
        style={[
          homeScannerStyles.snackbar,
          {
            backgroundColor: snackbarType === "success" ? "#4CAF50" : "#FF5252",
          },
        ]}
      >
        <Text
          style={[
            homeScannerStyles.snackbarText,
            { color: snackbarType === "success" ? "#FFFFFF" : "#FFFFFF" },
          ]}
        >
          {snackbarMessage}
        </Text>
      </Snackbar>
    </View>
  );
}
