import {
  StackActions,
  StaticScreenProps,
  useNavigation,
} from "@react-navigation/native";
import { useForm } from "react-hook-form";

import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Card } from "../../components/ui/card";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Header } from "../../components/ui/header";
import { Row } from "../../components/row";
import { Input } from "../../components/form/input";

import { api } from "../../services/api";
import { StepsCount } from "../../components/steps-count";
import { FormButton } from "../../components/form/form-button";
import { usePropertyStore } from "../../stores/createPropertyStore";
import { Select } from "../../components/form/select";
import { formatCEP, states } from "../../utils";
import { useEffect, useState } from "react";

type Props = StaticScreenProps<{ origin?: string }>;

export const StepThreeScreen = ({
  route: {
    params: { origin },
  },
}: Props) => {
  const { property } = usePropertyStore();

  const navigation = useNavigation();

  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);

  const {
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const watchedState = watch("state");
  const submit = async (values: any) => {
    return api
      .post("/api/v1/properties", {
        ...property,
        ...values,
        neighborhood: values.neighborhood.toUpperCase().trim(),
        street: values.street.toUpperCase().trim(),
      })
      .then(() =>
        navigation.dispatch(
          origin === "CreateChecklist"
            ? StackActions.popTo("CreateChecklist", {
                screen: "StepTwo",
                params: {
                  organization_id: property.organization_id,
                },
              })
            : StackActions.popTo("HomeRoutes", {
                screen: "PropertiesHomeScreen",
                params: {
                  refresh: true,
                },
              })
        )
      )
      .catch((e) => console.log(e));
  };

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

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BaseView style={{ gap: 16 }}>
          <StepsCount step={3} length={3} />
          <Row />
          <Card>
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
            title="SALVAR"
            icon="save"
          />
        </BaseView>
      </TouchableWithoutFeedback>
    </BaseSafeAreaView>
  );
};
