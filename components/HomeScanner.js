import React, { useState, useLayoutEffect, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [totalExpectedOutput, setTotalExpectedOutput] = useState(0);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    getFirstName();
  }, []);

  const getFirstName = async () => {
    const name = await AsyncStorage.getItem("userFirstName");
    setFirstName(name || "");
  };

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
            Line Incharge: {firstName} (in session)
          </Text>
        </View>
      ),

      // 2) Right side: e.g. "English" + date
      headerRight: () => (
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Text style={{ fontSize: 12 }}></Text>
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
  }, [navigation, line, noOfOps, firstName]);

  const showSnackbar = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 5000);
  };

  const groupedItems = () => {
    const groups = {};
    scannedItems.forEach((item) => {
      const key = `${item?.brand}_${item?.poSku}`;
      if (!groups[key]) {
        groups[key] = {
          brand: item?.brand,
          poSku: item?.poSku,
          items: [],
        };
      }
      groups[key].items.push(item);
    });
    return Object.values(groups);
  };

  const renderTableHeader = () => (
    <View style={homeScannerStyles.tableHeader}>
      <Text style={[homeScannerStyles.headerCell, { flex: 0.7 }]}>S.No.</Text>
      <Text style={[homeScannerStyles.headerCell, { flex: 1 }]}>Size</Text>
      <Text style={[homeScannerStyles.headerCell, { flex: 1.5 }]}>Serials</Text>
      <Text style={[homeScannerStyles.headerCell, { flex: 1 }]}>Tot. Qty</Text>
      <Text style={[homeScannerStyles.headerCell, { flex: 0.7 }]}>Action</Text>
    </View>
  );

  const renderGroupHeader = (brand, poSku) => (
    <View style={homeScannerStyles.groupHeader}>
      <View style={homeScannerStyles.groupHeaderLeft}>
        <Text style={homeScannerStyles.groupHeaderText}>{poSku}</Text>
      </View>
      <Text style={homeScannerStyles.groupHeaderSubText}>{brand}</Text>
    </View>
  );

  const renderTableRow = (item, index) => {
    let serialsToDisplay = "";

    if (item.serials?.length > 0) {
      // Case 1: Direct serials present
      serialsToDisplay = item.serials.join(", ");
    } else if (item.bundles?.length > 0) {
      // Case 2: Find serials from bundle that matches scanned barcode
      const bundle = item.bundles.find((b) => b.barcode === item.barcode);
      if (bundle?.serials?.length > 0) {
        const serialNumbers = bundle.serials
          .map((s) => {
            const match = s.serialId?.match(/_(\d+)$/);
            return match ? parseInt(match[1], 10) : null;
          })
          .filter(Boolean);

        if (serialNumbers.length > 0) {
          const minSerial = Math.min(...serialNumbers);
          const maxSerial = Math.max(...serialNumbers);
          serialsToDisplay = `${minSerial}-${maxSerial}`;
        } else {
          serialsToDisplay = `1 - ${item.totalQuantity}`;
        }
      } else {
        serialsToDisplay = `1 - ${item.totalQuantity}`;
      }
    } else {
      serialsToDisplay = `1 - ${item.totalQuantity}`;
    }

    return (
      <View key={item.id} style={homeScannerStyles.tableRow}>
        <Text style={[homeScannerStyles.cell, { flex: 0.5 }]}>{index + 1}</Text>
        <Text style={[homeScannerStyles.cell, { flex: 1 }]}>{item.size}</Text>
        <Text style={[homeScannerStyles.cell, { flex: 1.5 }]}>
          {serialsToDisplay}
        </Text>
        <Text style={[homeScannerStyles.cell, { flex: 1 }]}>
          {item.totalQuantity}
        </Text>
        <View style={[{ flex: 0.5, alignItems: "center" }]}>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDeleteItem(item?.id)}
            iconColor="#FF0000"
          />
        </View>
      </View>
    );
  };

  const renderPostAllocationHeader = () => (
    <View style={homeScannerStyles.postAllocationHeader}>
      <View style={homeScannerStyles.postAllocationSection}>
        <View>
          <Text
            style={[
              homeScannerStyles.postAllocationLabel,
              { color: "green", includeFontPadding: false },
            ]}
          >
            Bundles scanneds
          </Text>
        </View>
        <Text style={homeScannerStyles.postAllocationValue}>
          {scannedItems?.length}
        </Text>
      </View>
      <View style={homeScannerStyles.postAllocationSection}>
        <Text style={homeScannerStyles.postAllocationLabel}>
          Total expected output
        </Text>
        <Text style={homeScannerStyles.postAllocationValue}>
          {totalExpectedOutput} NOP
        </Text>
      </View>
    </View>
  );

  const handleAllocateBundles = async () => {
    if (scannedItems?.length === 0) {
      showSnackbar("No bundles to allocate", "error");
      return;
    }

    setAllocating(true);
    try {
      const allocationsData = scannedItems.map((item) => {
        let serials = "";

        if (item.serials?.length > 0) {
          serials = item.serials.join(", ");
        } else if (item.bundles?.length > 0) {
          const bundle = item.bundles.find((b) => b.barcode === item.barcode);
          if (bundle?.serials?.length > 0) {
            const serialNumbers = bundle.serials
              .map((s) => {
                const match = s.serialId?.match(/_(\d+)$/);
                return match ? parseInt(match[1], 10) : null;
              })
              .filter(Boolean);

            if (serialNumbers.length > 0) {
              const minSerial = Math.min(...serialNumbers);
              const maxSerial = Math.max(...serialNumbers);
              serials = `${minSerial}-${maxSerial}`;
            } else {
              serials = `1 - ${item.totalQuantity}`;
            }
          } else {
            serials = `1 - ${item.totalQuantity}`;
          }
        } else {
          serials = `1 - ${item.totalQuantity}`;
        }

        return {
          noOfOperator: parseInt(noOfOps),
          size: item?.size,
          qty: item?.totalQuantity,
          barcode: item?.barcode,
          brand: item?.brand,
          sku: item?.sku,
          poSku: item?.poSku,
          serials: serials,
        };
      });

      const total = scannedItems.reduce(
        (sum, item) => sum + item.totalQuantity,
        0
      );
      setTotalExpectedOutput(total);

      const token = await AsyncStorage.getItem("userToken");

      const response = await fetch(
        "https://stage-api.zyod.com/v1/lines/allocations/",
        // "https://dev-api.zyod.com/v1/lines/allocations/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lineId: lineId,
            allocationsData: allocationsData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to allocate bundles");
      }

      showSnackbar(
        `${scannedItems.length} bundles allocated successfully`,
        "success"
      );
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

  const handleBarcodeSubmit = async (scannedBarcode = null) => {
    try {
      const apiBarcode = (scannedBarcode || barcode).toString();
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `https://stage-api.zyod.com/v1/barcodes/batchDetailsFromBarcode?barcode=${apiBarcode}`,
        // `https://dev-api.zyod.com/v1/barcodes/batchDetailsFromBarcode?barcode=${apiBarcode}`,
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
        const errorMessage = data.message || "Failed to add raw material";
        throw new Error(errorMessage);
      }

      // Check if item already exists
      const isDuplicate = scannedItems.some(
        (item) => item.id === data.data.barcode
      );

      if (isDuplicate) {
        showSnackbar(
          `${data?.data?.batchDetails?.skuCode} is already scanned`,
          "error"
        );
        return;
      }

      if (data.data?.barcodeType && data.data.barcodeType !== "BUNDLE") {
        showSnackbar(
          `Please make sure that you have scanned a bundle and not ${
            data?.data?.barcodeType
              ? `a ${data?.data?.barcodeType}`
              : "something else"
          }`,
          "error"
        );
        return;
      }

      if (!data?.data?.brandName) {
        showSnackbar(
          `No brand name provided in ${data?.data?.batchDetails?.skuCode}`,
          "error"
        );
        return;
      }

      let size = null;
      if (data.data.barcodeType == "BUNDLE") {
        size = data?.data?.batchDetails?.bundles?.find(
          (item) => item?.barcode === data?.data?.barcode
        )?.size;
        if (size === null) {
          data?.data?.batchDetails?.bundles?.forEach((bundle) =>
            bundle?.serials?.forEach((item) => {
              if (item?.barcode === data?.data?.barcode) {
                size = item?.size;
              }
            })
          );
        }
      } else {
        data?.data?.batchDetails?.bundles?.forEach((bundle) =>
          bundle?.serials?.forEach((item) => {
            if (item?.barcode === data?.data?.barcode) {
              size = item?.size;
            }
          })
        );
      }

      // console.log("data.data:", JSON.stringify(data.data, null, 2));

      // Add the scanned item to the list with all necessary data

      // console.log("data\n", JSON.stringify(data.data, null, 2));
      const newItem = {
        id: data?.data?.barcode,
        size: size,
        serials: data?.data?.batchDetails?.serials,
        totalQuantity: data?.data?.remainingQuantity,
        brand: data?.data?.brandName,
        barcode: data?.data?.barcode,
        sku: data?.data?.batchDetails?.skuCode,
        poSku: data?.data?.batchDetails?.metadata?.finishedGoodDetails?.code,
        bundles: data?.data?.batchDetails?.bundles,
      };
      // console.log(">>newItem:", JSON.stringify(newItem, null, 2));

      setScannedItems((prevItems) => [newItem, ...prevItems]);
      setBarcode(""); // Clear the input after successful scan
      showSnackbar(
        `${data.data.batchDetails.skuCode} scanned successfully`,
        "success"
      );
    } catch (error) {
      showSnackbar(error.message || "Failed to scan barcode", "error");
    }
  };

  const handleScanButtonPress = () => {
    setShowScanner(true);
  };

  const handleBarcodeScanned = (scannedValue) => {
    handleBarcodeSubmit(scannedValue);
  };

  return (
    <View style={homeScannerStyles.container}>
      {/* Show scan input container only before allocation */}
      {!allocated && (
        <View style={homeScannerStyles.scanInputContainer}>
          {/* <List.Subheader>Enter bundle code</List.Subheader> */}
          <View style={homeScannerStyles.scanInputBox}>
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
                  theme={{
                    dark: false,
                  }}
                  activeOutlineColor="black"
                  outlineColor="black"
                  textColor="black"
                />
              </View>
              <TouchableOpacity
                style={homeScannerStyles.scanCameraBox}
                onPress={handleScanButtonPress}
              >
                <Ionicons name="camera-outline" size={36} color="#000" />
              </TouchableOpacity>
            </View>
            <Text style={homeScannerStyles.scanText}>
              Scan any bundle barcode or type the code (Ex: 001)
            </Text>
          </View>
        </View>
      )}

      {/* Show post-allocation header after allocation */}
      {allocated && renderPostAllocationHeader()}

      {/* Table Section */}
      <View style={homeScannerStyles.tableWrapper}>
        <ScrollView style={homeScannerStyles.tableContainer}>
          {groupedItems().map((group, groupIndex) => (
            <View key={groupIndex} style={homeScannerStyles.groupContainer}>
              {renderGroupHeader(group.brand, group.poSku)}
              {renderTableHeader()}
              {group.items.map((item, index) => renderTableRow(item, index))}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Allocate Button */}
      {scannedItems.length > 0 && !allocated && (
        <View style={homeScannerStyles.buttonView}>
          <Button
            mode="contained"
            // onPress={() => navigation.navigate("Home Start")}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Home Start" }],
              })
            }
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
            // onPress={() => navigation.navigate("Home Start")}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Home Start" }],
              })
            }
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
