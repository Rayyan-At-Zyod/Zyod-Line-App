import { StyleSheet } from "react-native";

export const homeScannerStyles = StyleSheet.create({
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
    backgroundColor: "#dddddd",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 80,
    paddingHorizontal: 10,
  },
  scanCameraBox: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  scanBox: {
    // backgroundColor: "brown",
    flex: 1,
    height: 40,
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  codeText: {
    fontSize: 14,
    height: 45,
    minWidth: "100%",
    backgroundColor: "white",
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
