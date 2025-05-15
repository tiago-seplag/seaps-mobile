import React from "react";
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

interface PropertyForm {
  name: string;
  address: string;
  organization_id: string;
}

export function CreateProperty() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PropertyForm>();

  const submit = async (values: any) => {
    console.log(values);
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
          Criar Propriedade
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
              control={control}
              errors={errors}
              name="organization_id"
              label="Orgão"
              placeholder="Selecione o orgão"
              errorMessage="Insira o orgão do imóvel"
            />
            <Select
              label="Responsável"
              placeholder="Selecione o Responsável do imóvel"
              control={control}
              errors={errors}
              name="organization_id"
              errorMessage="Selecione o Responsável do imóvel"
            />
            <Select
              label="Tipo de Imóvel"
              placeholder="Selecione o tipo do imóvel"
              control={control}
              errors={errors}
              name="organization_id"
              errorMessage="Selecione o tipo do imóvel"
            />
            <Input
              control={control}
              errors={errors}
              label="Nome"
              name="name"
              placeholder="Nome do local"
              errorMessage="Insira o nome do imóvel"
            />
            <Input
              control={control}
              errors={errors}
              label="Endereço"
              name="address"
              placeholder="ex.: R. C, S/N - Centro Político Administrativo..."
              errorMessage="Insira o endereço do imóvel"
            />
            <TouchableOpacity
              onPress={handleSubmit(submit)}
              style={styles.button}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Criar
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
  button: {
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
});
