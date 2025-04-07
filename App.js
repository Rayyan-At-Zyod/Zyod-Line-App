import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import AppHome from "./components/AppHome";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppHome />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
