import { StyleSheet } from "react-native";

export default homeStartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Light grey background to match typical Figma
    padding: 16,
  },
  card: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  textInput: {
    backgroundColor: "#fff",
    // If you want a custom outline color or rounding:
    // Add theme prop in <TextInput> or style below:
    // borderRadius: 8,
  },
  dropdownButton: {
    borderRadius: 8,
    borderColor: "#ccc", // Outline color
    backgroundColor: "#fff",
    borderWidth: 1,
    justifyContent: "space-between",
  },
  dropdownButtonContent: {
    flexDirection: "row-reverse", // Moves icon to the right
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonLabel: {
    fontSize: 14,
    color: "#333",
    textTransform: "none", // keep text normal case
  },
  disabledButton: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: "#ddd", // Black background
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: "#000", // Black background
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff", // White text
  },
  loadingContainer: {
    padding: 10,
    alignItems: "center",
  },
  errorText: {
    color: "#FF0000",
    padding: 10,
    textAlign: "center",
  },
});


