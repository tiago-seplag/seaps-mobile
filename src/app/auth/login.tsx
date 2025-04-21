import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSession } from "../../contexts/authContext";
import { Controller, useForm } from "react-hook-form";

import { StatusBar } from "expo-status-bar";
import { api } from "../../services/api";
import Materialnicons from "@expo/vector-icons/MaterialIcons";
import Logo from "../../../assets/splash-icon-white.png";

export function Login() {
  const { signIn } = useSession();

  const [showPassword, setShowPassword] = useState(false);

  const submitLogin = async ({ email, password }: any) => {
    try {
      const { data } = await api.post("api/auth/mobile/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
      signIn(data.SESSION);
    } catch (err: any) {
      console.log(err);
    }
  };

  const { handleSubmit, control } = useForm();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1a3180" translucent />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Image source={Logo} style={styles.image} />
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                textAlign: "center",
                color: "white",
              }}
            >
              Sistema de Manutenção Predial
            </Text>
            <View style={{ marginVertical: 32, display: "flex", gap: 16 }}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                name={"email"}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Email"
                      keyboardType="email-address"
                      value={value}
                      onChangeText={onChange}
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>
                )}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  name={"password"}
                  render={({ field: { onChange, value } }) => (
                    <View style={{ ...styles.inputContainer, width: "75%" }}>
                      <TextInput
                        placeholder="Senha"
                        secureTextEntry={!showPassword}
                        value={value}
                        onChangeText={onChange}
                        onSubmitEditing={Keyboard.dismiss}
                      />
                      <TouchableOpacity></TouchableOpacity>
                    </View>
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={[styles.button, { width: "24%", paddingVertical: 9 }]}
                >
                  <Materialnicons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={24}
                    color={"#1A1A1A"}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ display: "flex", gap: 16 }}>
              <TouchableOpacity
                onPress={handleSubmit(submitLogin)}
                style={styles.button}
              >
                <Text
                  style={{
                    fontSize: 16,
                  }}
                >
                  Entrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    display: "flex",
    paddingHorizontal: 8,
    backgroundColor: "white",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#3b3b3b",
  },
  keyboardView: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  container: {
    flex: 1,
    backgroundColor: "#1a3180",
  },
  image: {
    width: "100%",
    height: 150,
    objectFit: "contain",
  },
  button: {
    backgroundColor: "white",
    borderColor: "#3b3b3b",
    padding: 4,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignSelf: "flex-end",
    width: "30%",
    display: "flex",
    alignItems: "center",
  },
});
