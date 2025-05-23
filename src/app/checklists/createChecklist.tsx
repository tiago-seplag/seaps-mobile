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

interface ChecklistForm {
  model_id: string;
  organization_id: string;
  property_id: string;
  user_id: string;
}

export function CreateChecklist() {
  const focus = useIsFocused();

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const screen = useNavigation<NativeStackNavigationProp<any>>();

  const {
    reset,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChecklistForm>();

  useEffect(() => {
    if (focus) {
      reset({
        organization_id: "",
      });
    }
    api.get("/api/organizations").then(({ data }) => setOrganizations(data));
    api.get("/api/models").then(({ data }) => setModels(data));
    api.get("/api/users").then(({ data }) => setUsers(data));
  }, [focus]);

  const [organization_id] = watch(["organization_id"]);

  useEffect(() => {
    if (organization_id) {
      api
        .get("/api/organizations/" + organization_id + "/properties")
        .then(({ data }) => setProperties(data));
    }
  }, [organization_id]);

  const submit = async (values: ChecklistForm) => {
    const data = {
      ...values,
    };

    return api
      .post("/api/checklists", data)
      .then(() =>
        screen.popTo("ChecklistsScreen", {
          refresh: true,
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
          Criar Checklist
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
              options={models}
              control={control}
              errors={errors}
              name="model_id"
              label="Modelo"
              placeholder="Selecione um modelo"
              errorMessage="Selecione o modelo do checklist"
            />
            <Select
              options={organizations}
              control={control}
              errors={errors}
              name="organization_id"
              label="Orgão"
              placeholder="Selecione um orgão"
              errorMessage="Selecione o orgão do checklist"
            />
            {organization_id && (
              <Select
                options={properties}
                control={control}
                errors={errors}
                name="property_id"
                label="Propriedade"
                placeholder="Selecione uma propriedade"
                errorMessage="Selecione a propriedade do checklist"
              />
            )}
            <Select
              options={users}
              control={control}
              errors={errors}
              name="user_id"
              label="Responsável"
              placeholder="Selecione um responsável"
              errorMessage="Selecione o responsável do checklist"
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
