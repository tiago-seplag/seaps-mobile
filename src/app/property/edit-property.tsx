import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
import {
  BaseSafeAreaView,
  BaseScrollView,
  BaseView,
} from "../../components/skeleton";
import { Header } from "../../components/ui/header";
import { FormButton } from "../../components/form/form-button";
import { Card } from "../../components/ui/card";
import { Icon } from "../../components/icon";
import axios from "axios";
import { formatCEP, states } from "../../utils";

interface PropertyForm {
  name: string;
  address: string;
  organization_id: string;
  person_id: string;
  type: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
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
  const [cities, setCities] = useState<any[]>([]);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyForm>({
    defaultValues: {
      address: property.address,
      name: property.name,
      organization_id: property.organization_id,
      person_id: property.person_id,
      type: property.type,
      cep: property.cep || "",
      state: property.state || "",
      city: property.city || "",
      neighborhood: property.neighborhood || "",
      street: property.street || "",
    },
  });

  const watchedState = watch("state");

  useEffect(() => {
    api
      .get("/api/v1/organizations?per_page=100")
      .then(({ data }) => setOrganizations(data.data))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (property && isFocused) {
      api
        .get("/api/v1/persons/?organization_id&per_page=1000")
        .then(({ data }) => setResponsible(data.data))
        .catch((e) => console.log(e));
    }
  }, [property, isFocused]);

  useEffect(() => {
    if (property.state) {
      axios
        .get(
          `https://brasilapi.com.br/api/ibge/municipios/v1/${property.state}?providers=dados-abertos-br,gov,wikipedia`
        )
        .then(({ data }) => {
          setCities(
            data.map((city: { nome: string; codigo_ibge: string }) => ({
              id: city.nome.replace(/\s*\(.*?\)/g, ""),
              name: city.nome.replace(/\s*\(.*?\)/g, ""),
            }))
          );
        })
        .catch((e) => console.log(e));
    }
  }, [property]);

  useEffect(() => {
    if (watchedState) {
      api
        .get(
          `https://brasilapi.com.br/api/ibge/municipios/v1/${watchedState}?providers=dados-abertos-br,gov,wikipedia`
        )
        .then(({ data }) => {
          setCities(
            data.map((city: { nome: string; codigo_ibge: string }) => ({
              id: city.nome.replace(/\s*\(.*?\)/g, ""),
              name: city.nome.replace(/\s*\(.*?\)/g, ""),
            }))
          );
        })
        .catch((e) => console.log(e));
    }
  }, [watchedState]);

  const findAddressByCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setValue("street", data.logradouro?.toUpperCase() || "");
        setValue("neighborhood", data.bairro?.toUpperCase() || "");
        setValue("city", data.localidade.toUpperCase() || "");
        setValue("state", data.uf || "");
      }
    } catch (error) {
      console.log("Error fetching CEP:", error);
    }
  };

  const submit = async (values: PropertyForm) => {
    const data = {
      ...values,
      address: values.address.toUpperCase().trim(),
      name: values.name.toUpperCase().trim(),
      neighborhood: values.neighborhood.toUpperCase().trim(),
      street: values.street.toUpperCase().trim(),
    };

    return api
      .put("/api/v1/properties/" + property.id, data)
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BaseScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                label="CEP:"
                name="cep"
                placeholder="00000-000"
                errorMessage="Insira o CEP"
                maxLength={9}
                onChangeText={(value) => {
                  const formatted = formatCEP(value);
                  setValue("cep", formatted);
                  if (formatted.length === 9) {
                    findAddressByCEP(formatted.replace("-", ""));
                  }
                }}
              />
              <Select
                label="ESTADO:"
                placeholder="Selecione o Estado"
                control={control}
                errors={errors}
                name="state"
                errorMessage="Selecione o Estado"
                options={states.map((state) => ({
                  id: state.acronym,
                  name: state.name.toUpperCase(),
                }))}
              />
              <Select
                label="CIDADE:"
                placeholder="Selecione a Cidade"
                control={control}
                errors={errors}
                name="city"
                errorMessage="Selecione a Cidade"
                options={cities}
                disabled={!watchedState}
              />
              <Input
                control={control}
                errors={errors}
                label="BAIRRO:"
                name="neighborhood"
                placeholder="Digite o bairro"
                errorMessage="Insira o bairro"
              />
              <Input
                control={control}
                errors={errors}
                label="RUA:"
                name="street"
                placeholder="Digite a rua"
                errorMessage="Insira a rua"
              />
              <Input
                control={control}
                errors={errors}
                label="ENDEREÇO COMPLETO:"
                name="address"
                placeholder="ex.: R. C, S/N - Centro Político Administrativo..."
                errorMessage="Insira o endereço do imóvel"
                maxLength={255}
                multiline
                style={{ minHeight: 44 * 3.1 }}
              />
            </Card>
          </TouchableWithoutFeedback>
          <FormButton
            onPress={handleSubmit(submit)}
            icon="save"
            title="SALVAR"
          />
        </BaseScrollView>
      </KeyboardAvoidingView>
    </BaseSafeAreaView>
  );
}
