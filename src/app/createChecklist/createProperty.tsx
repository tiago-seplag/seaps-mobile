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
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Materialnicons from "@expo/vector-icons/MaterialIcons";
import { useChecklistForm } from "../../contexts/checklistContext";

interface PropertyForm {
  name: string;
  address: string;
  organization_id: string;
  person_id: string;
  type: string;
}

export function CreateProperty() {
  const focus = useIsFocused();
  const { checklist } = useChecklistForm();

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [responsible, setResponsible] = useState<any[]>([]);
  const screen = useNavigation<NativeStackNavigationProp<any>>();

  const {
    reset,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PropertyForm>();

  useEffect(() => {
    if (focus) {
      reset({
        organization_id: checklist?.organization?.id,
      });
    }
    api.get("/api/organizations").then(({ data }) => setOrganizations(data));
  }, [focus]);

  const [organization_id] = watch(["organization_id"]);

  useEffect(() => {
    if (organization_id) {
      api
        .get("/api/organizations/" + organization_id + "/responsible")
        .then(({ data }) => setResponsible(data));
    }
  }, [organization_id]);

  const submit = async (values: PropertyForm) => {
    const data = {
      ...values,
      address: values.address.toUpperCase().trim(),
      name: values.name.toUpperCase().trim(),
    };

    return api
      .post("/api/properties", data)
      .then(() =>
        screen.popTo("SelectProperty", {
          refresh: Date.now(),
        })
      )
      .catch((e) => console.log(e));
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
              options={organizations}
              control={control}
              errors={errors}
              name="organization_id"
              label="Orgão"
              placeholder="Selecione o orgão"
              errorMessage="Insira o orgão do imóvel"
            />
            {organization_id && (
              <Select
                label="Responsável"
                placeholder="Selecione o Responsável do imóvel"
                control={control}
                errors={errors}
                name="person_id"
                errorMessage="Selecione o Responsável do imóvel"
                options={responsible}
                button={
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => screen.push("CreateResponsible")}
                  >
                    <Materialnicons name="add" size={24} color={"#1a3180"} />
                  </TouchableOpacity>
                }
              />
            )}
            <Select
              label="Tipo de Imóvel"
              placeholder="Selecione o tipo do imóvel"
              control={control}
              errors={errors}
              name="type"
              errorMessage="Selecione o tipo do imóvel"
              options={[
                { id: "OWN", name: "PRÓPRIO" },
                { id: "RENTED", name: "ALUGADO" },
                { id: "GRANT", name: "CONCESSÃO" },
              ]}
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
              style={styles.saveButton}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                CRIAR
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
