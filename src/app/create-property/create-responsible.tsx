import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useForm } from "react-hook-form";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";

import { Input } from "../../components/form/input";
import { Select } from "../../components/form/select";
import { api } from "../../services/api";

import { FormButton } from "../../components/form/form-button";
import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Header } from "../../components/ui/header";
import { Card } from "../../components/ui/card";

import { CreatePropertyRoutesProps } from "./route";

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
  const navigate = useNavigation<CreatePropertyRoutesProps>();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResponsibleForm>({
    defaultValues: {
      organization_id: organization_id,
    },
  });

  useEffect(() => {
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
      .then(() => navigate.goBack())
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
        <FormButton onPress={handleSubmit(submit)} title="SALVAR" icon="save" />
      </BaseView>
    </BaseSafeAreaView>
  );
}
