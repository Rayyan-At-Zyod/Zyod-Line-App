import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedToken, storedUserData] = await Promise.all([
        AsyncStorage.getItem("userToken"),
        AsyncStorage.getItem("userData"),
      ]);

      if (storedToken && storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);

        setToken(storedToken);
        setUserData(parsedUserData);
      }
    } catch (error) {
      console.error("=== Error Loading Stored Data ===");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (token, user) => {
    try {
      // storing user data in async storage
      await Promise.all([
        AsyncStorage.setItem("userToken", token),
        AsyncStorage.setItem("userData", JSON.stringify(user)),
      ]);

      setToken(token);
      setUserData(user);
      loadStoredData();
    } catch (error) {
      console.error("=== Error Storing Auth Data ===");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      throw error;
    }
  };

  const signOut = async () => {
    console.log("=== Sign Out Process ===");
    try {
      await Promise.all([
        AsyncStorage.removeItem("userToken"),
        AsyncStorage.removeItem("userData"),
      ]);
      setToken(null);
      setUserData(null);
    } catch (error) {
      console.error("=== Error During Sign Out ===");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // Even if AsyncStorage fails, we should still clear the context
      setToken(null);
      setUserData(null);
    } finally {
      console.log("Sign out process completed");
    }
  };

  return (
    <AuthContext.Provider value={{ token, userData, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
