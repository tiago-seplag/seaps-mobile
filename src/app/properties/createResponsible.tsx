import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useForm } from "react-hook-form";

import { SafeAreaView } from "react-native-safe-area-context";

import { Input } from "../../components/form/input";
import { Select } from "../../components/form/select";
import { api } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface ResponsibleForm {
  organization_id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export function CreateResponsible() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const screen = useNavigation<NativeStackNavigationProp<any>>();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResponsibleForm>();

  useEffect(() => {
    api.get("/api/organizations").then(({ data }) => setOrganizations(data));
  }, []);

  const submit = async (values: ResponsibleForm) => {
    const data = {
      ...values,
      role: values.role.toUpperCase().trim(),
      name: values.name.toUpperCase().trim(),
      email: values.email.toUpperCase().trim(),
      phone: values.phone.replace(/\D/g, ""),
    };

    return api
      .post("/api/responsible", data)
      .then(() => screen.goBack())
      .catch((e) => console.log(e.response.data));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title} numberOfLines={1}>
          Criar Responsável
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.form}>
            <Select
              options={organizations}
              control={control}
              errors={errors}
              name="organization_id"
              label="Orgão"
              placeholder="Selecione o responsável"
              errorMessage="Insira o orgão do responsável"
            />
            <Input
              control={control}
              errors={errors}
              label="Nome"
              name="name"
              placeholder="Nome do responsável"
              errorMessage="Insira o nome do responsável"
            />
            <Input
              control={control}
              errors={errors}
              label="Cargo"
              name="role"
              placeholder="Cargo do responsável"
              errorMessage="Insira o cargo do responsável"
            />
            <Input
              control={control}
              errors={errors}
              label="Email"
              name="email"
              placeholder="Email do responsável"
              errorMessage="Insira o Email do responsável"
              keyboardType="email-address"
            />
            <Input
              control={control}
              errors={errors}
              label="Telefone"
              name="phone"
              placeholder="Telefone do responsável"
              errorMessage="Insira o Telefone do imóvel"
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              onPress={handleSubmit(submit)}
              style={styles.saveButton}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                SALVAR
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#e8e8e8",
    shadowColor: "black",
    justifyContent: "flex-start",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 16,
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
    gap: 8,
  },
  saveButton: {
    backgroundColor: "#58e68e",
    borderColor: "#1c492e",
    padding: 4,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    paddingVertical: 10,
    alignSelf: "flex-end",
    width: "30%",
    display: "flex",
    alignItems: "center",
  },
  button: {
    borderColor: "#1a3180",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    width: 40,
    display: "flex",
    alignItems: "center",
  },
});
