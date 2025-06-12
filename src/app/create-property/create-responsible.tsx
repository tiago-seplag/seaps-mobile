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

import { Input } from "../../components/form/input";
import { Select } from "../../components/form/select";
import { api } from "../../services/api";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useChecklistForm } from "../../contexts/checklistContext";
import { Header } from "../../components/ui/header";
import { Card } from "../../components/ui/card";
import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface ResponsibleForm {
  organization_id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

type Props = StaticScreenProps<{
  organization_id: string;
}>;

export function CreateResponsibleScreen({
  route: {
    params: { organization_id },
  },
}: Props) {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const screen = useNavigation<NativeStackNavigationProp<any>>();
  const { checklist } = useChecklistForm();

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResponsibleForm>({
    defaultValues: {
      organization_id: organization_id,
    },
  });

  useEffect(() => {
    reset({
      organization_id: checklist?.organization?.id,
    });
    api.get("/api/organizations").then(({ data }) => setOrganizations(data));
  }, []);

  const submit = async (values: ResponsibleForm) => {
    const data = {
      ...values,
      role: values.role.toUpperCase().trim(),
      name: values.name.toUpperCase().trim(),
      email: values.email.toLocaleLowerCase().trim(),
      phone: values.phone.replace(/\D/g, ""),
    };

    return api
      .post("/api/responsible", data)
      .then(() => screen.goBack())
      .catch((e) => console.log(e.response.data));
  };

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR RESPONSÁVEL"} />
      <BaseView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Card style={{ gap: 16, paddingVertical: 14 }}>
            <KeyboardAvoidingView
              behavior="padding"
              keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
              style={{ gap: 16 }}
            >
              <Select
                options={organizations}
                control={control}
                errors={errors}
                name="organization_id"
                label="ORGÃO:"
                placeholder="Selecione o responsável"
                errorMessage="Insira o orgão do responsável"
                disabled
              />
              <Input
                control={control}
                errors={errors}
                label="NOME:"
                name="name"
                placeholder="Nome do responsável"
                errorMessage="Insira o nome do responsável"
              />
              <Input
                control={control}
                errors={errors}
                label="CARGO:"
                name="role"
                placeholder="Cargo do responsável"
                errorMessage="Insira o cargo do responsável"
              />
              <Input
                control={control}
                errors={errors}
                label="EMAIL:"
                name="email"
                placeholder="Email do responsável"
                errorMessage="Insira o Email do responsável"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                control={control}
                errors={errors}
                label="TELEFONE:"
                name="phone"
                placeholder="Telefone do responsável"
                errorMessage="Insira o Telefone do imóvel"
                keyboardType="phone-pad"
              />
            </KeyboardAvoidingView>
          </Card>
        </TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={handleSubmit(submit)}
          style={{
            flexDirection: "row",
            marginTop: "auto",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#067C03",
            padding: 12,
            borderRadius: 12,
            gap: 4,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#FEFEFE",
            }}
          >
            PROXIMO
          </Text>
          <MaterialIcons name={"chevron-right"} size={32} color={"#FEFEFE"} />
        </TouchableOpacity>
      </BaseView>
    </BaseSafeAreaView>
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
