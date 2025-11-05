import React, { useState } from "react";
import {
  ActivityIndicator,
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

import { api } from "../../services/api";
import { Toast } from "toastify-react-native";
import { MtLogginButton } from "./MtLoginButton";
import Materialnicons from "@expo/vector-icons/MaterialIcons";
import Logo from "../../../assets/splash-icon-dark.png";

export function Login() {
  const { signIn } = useSession();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitLogin = async ({ email, password }: any) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/v1/sessions", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
      signIn(data.token);
    } catch (err: any) {
      if (err.message) {
        Toast.error(err.message);
      }
      if (err.response?.data?.message) {
        return Toast.error(err.response.data.message);
      }
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.form}>
          <Image
            source={Logo}
            style={{
              width: 200,
              height: 200,
              alignSelf: "center",
              objectFit: "cover",
            }}
          />
          <Text style={styles.label}>EMAIL:</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            name={"email"}
            render={({ field: { onChange, value } }) => (
              <TextInput
                keyboardType="email-address"
                placeholder="Insira seu email"
                value={value}
                style={styles.input}
                onChangeText={onChange}
                onSubmitEditing={Keyboard.dismiss}
              />
            )}
          />
          {errors.email ? (
            <Text style={styles.errorText}>Insira o email</Text>
          ) : null}
          <Text style={styles.label}>SENHA:</Text>
          <View
            style={{
              flexDirection: "row",
              gap: 3,
              marginBottom: 15,
            }}
          >
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              name={"password"}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Insira sua senha"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  onSubmitEditing={Keyboard.dismiss}
                />
              )}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={[
                styles.button,
                {
                  height: 42,
                  width: "20%",
                  paddingVertical: 0,
                  justifyContent: "center",
                  borderRadius: 12,
                  backgroundColor: "#1A3180",
                },
              ]}
            >
              <Materialnicons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color={"#FEFEFE"}
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>Insira a senha</Text>
          ) : null}
          <TouchableOpacity
            onPress={handleSubmit(submitLogin)}
            style={[
              styles.button,
              { backgroundColor: "#067C03", opacity: loading ? 0.5 : 1 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={"#FEFEFE"} />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#FEFEFE",
                }}
              >
                ENTRAR
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      <MtLogginButton />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1a3180",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 300,
    color: "#0E1B46",
    marginLeft: 12,
  },
  input: {
    minHeight: 42,
    fontSize: 14,
    color: "#182D74",
    borderColor: "#1A3180",
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#f75656",
    marginTop: -10,
    marginBottom: 10,
  },
  button: {
    padding: 4,
    borderRadius: 8,
    height: 42,
    paddingVertical: 10,
    alignSelf: "flex-end",
    width: "50%",
    display: "flex",
    alignItems: "center",
  },
});
