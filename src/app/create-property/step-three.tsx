import {
  StackActions,
  StaticScreenProps,
  useNavigation,
} from "@react-navigation/native";
import { useForm } from "react-hook-form";

import {
  BaseSafeAreaView,
  BaseScrollView,
  BaseView,
} from "../../components/skeleton";
import { Card } from "../../components/ui/card";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
      .post("/api/v2/properties", {
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
              }),
        ),
      )
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (watchedState) {
      api
        .get("/api/v2/address/cities/" + watchedState)
        .then(({ data }) => {
          setCities(
            data.map((city: { name: string; id: string }) => ({
              id: city.name.replace(/\s*\(.*?\)/g, ""),
              name: city.name.replace(/\s*\(.*?\)/g, ""),
            })),
          );
        })
        .catch((e) => console.log(e));
    }
  }, [watchedState]);

  const findAddressByCEP = async (cep: string) => {
    try {
      const data = await api
        .get(`/api/v2/address/zipcode/${cep}`)
        .then(({ data }) => data);

      if (data) {
        setValue("street", data.street?.toUpperCase() || "");
        setValue("neighborhood", data.neighborhood?.toUpperCase() || "");
        setValue("city", data.city?.toUpperCase() || "");
        setValue("state", data.state || "");
        setValue(
          "address",
          `${data.street} - ${data.neighborhood}, ${data.city} - ${data.state}, ${cep}`.toUpperCase(),
        );
      }
    } catch (error) {
      console.log("Error fetching CEP:", error);
    }
  };

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <BaseView style={{ gap: 16 }}>
            <StepsCount step={3} length={3} />
            <Row />
            <Card style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1 }}>
                <View style={{ gap: 4 }}>
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
                    keyboardType="numeric"
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
                </View>
              </ScrollView>
            </Card>
            <FormButton
              onPress={handleSubmit(submit)}
              title="SALVAR"
              icon="save"
            />
          </BaseView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BaseSafeAreaView>
  );
};
