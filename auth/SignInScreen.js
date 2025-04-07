import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const SignInScreen = () => {
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://dev-api.zyod.com/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: username,
          Password: password,
          PortalId: 3,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Sign in failed");
      }

      if (!data.data?.token || !data.data?.user) {
        throw new Error("Invalid response format");
      }
      await signIn(data.data.token, data.data.user);
    } catch (err) {
      console.error("Detailed error:", err);
      if (err.message === "Network request failed") {
        setError(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        setError(err.message || "An error occurred during sign in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 64}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign In</Text>

            {error && <Text style={styles.error}>{error}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              onSubmitEditing={() => passwordRef.current?.focus()}
              textContentType="username"
              autoComplete="username"
              autoCapitalize="none"
              returnKeyType="next"
              mode="outine"
            />

            <TextInput
              mode="outine"
              ref={passwordRef}
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
              autoComplete="password"
              autoCapitalize="none"
              returnKeyType="send"
              onSubmitEditing={handleSignIn}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.signUpbutton}
              onPress={() => navigation.navigate("SignUp")}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.signUpButtonText}>New User? Sign Up.</Text>
              )}
            </TouchableOpacity> */}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  signUpbutton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  signUpButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default SignInScreen;
