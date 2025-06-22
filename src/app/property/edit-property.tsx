import React, { useEffect, useState } from "react";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  StackActions,
  StaticScreenProps,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useForm } from "react-hook-form";

import { Input } from "../../components/form/input";
import { Select } from "../../components/form/select";
import { api } from "../../services/api";
import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Header } from "../../components/ui/header";
import { FormButton } from "../../components/form/form-button";
import { Card } from "../../components/ui/card";
import { Icon } from "../../components/icon";

interface PropertyForm {
  name: string;
  address: string;
  organization_id: string;
  person_id: string;
  type: string;
}

type Props = StaticScreenProps<{
  property: any;
}>;

export function EditProperty({ route }: Props) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [property] = useState<any>(route.params.property);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [responsible, setResponsible] = useState<any[]>([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PropertyForm>({
    defaultValues: {
      address: property.address,
      name: property.name,
      organization_id: property.organization_id,
      person_id: property.person_id,
      type: property.type,
    },
  });

  useEffect(() => {
    api.get("/api/organizations").then(({ data }) => setOrganizations(data));
  }, []);

  useEffect(() => {
    if (property && isFocused) {
      api
        .get("/api/organizations/" + property.organization_id + "/responsible")
        .then(({ data }) => setResponsible(data));
    }
  }, [property, isFocused]);

  const submit = async (values: PropertyForm) => {
    const data = {
      ...values,
      address: values.address.toUpperCase().trim(),
      name: values.name.toUpperCase().trim(),
    };

    return api
      .put("/api/properties/" + property.id, data)
      .then(() =>
        navigation.dispatch(
          StackActions.popTo("HomeRoutes", {
            screen: "PropertiesHomeScreen",
            params: {
              refresh: Date.now(),
            },
          })
        )
      )
      .catch((e) => console.log(e.response.data));
  };

  return (
    <BaseSafeAreaView>
      <Header backButton title={property.name} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BaseView>
          <Card style={{ gap: 8 }}>
            <Select
              options={organizations}
              control={control}
              errors={errors}
              name="organization_id"
              label="ORGÃO:"
              placeholder="Selecione o orgão"
              errorMessage="Insira o orgão do imóvel"
            />
            <Select
              label="RESPONSÁVEL:"
              placeholder="Selecione o Responsável do imóvel"
              control={control}
              errors={errors}
              name="person_id"
              errorMessage="Selecione o Responsável do imóvel"
              options={responsible}
              button={
                <TouchableOpacity
                  onPress={() =>
                    navigation.dispatch(
                      StackActions.push("CreateProperty", {
                        screen: "CreateResponsible",
                        params: {
                          organization_id: property.organization_id,
                        },
                      })
                    )
                  }
                >
                  <Icon
                    style={{
                      padding: 0,
                      marginBottom: 4,
                      height: 40,
                      width: 40,
                      borderWidth: 1,
                      borderColor: "#182D74",
                    }}
                    icon="add"
                  />
                </TouchableOpacity>
              }
            />
            <Select
              label="TIPO DE IMÓVEL:"
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
              label="NOME:"
              name="name"
              placeholder="Nome do local"
              errorMessage="Insira o nome do imóvel"
            />
            <Input
              control={control}
              errors={errors}
              label="ENDEREÇO:"
              name="address"
              placeholder="ex.: R. C, S/N - Centro Político Administrativo..."
              errorMessage="Insira o endereço do imóvel"
              maxLength={255}
              multiline
              style={{ minHeight: 44 * 3.1 }}
            />
          </Card>
          <FormButton
            onPress={handleSubmit(submit)}
            icon="save"
            title="SALVAR"
          />
        </BaseView>
      </TouchableWithoutFeedback>
    </BaseSafeAreaView>
  );
}
