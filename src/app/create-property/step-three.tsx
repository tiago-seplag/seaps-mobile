import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";

import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Card } from "../../components/ui/card";
import { Text, TouchableOpacity } from "react-native";
import { Header } from "../../components/ui/header";
import { Row } from "../../components/row";
import { Input } from "../../components/form/input";

import { api } from "../../services/api";

type Props = StaticScreenProps<undefined>;

export const StepThreeScreen = (_: Props) => {
  const navigation = useNavigation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const submit = async (values: any) => {
    return api
      .post("/api/checklists", values)
      .then(() =>
        navigation.navigate("HomeRoutes", {
          screen: "PropertiesHomeScreen",
          params: {
            refresh: true,
          },
        })
      )
      .catch((e) => console.log(e));
  };

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <BaseView>
        <Row />
        <Card>
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
        </Card>
        <TouchableOpacity onPress={() => handleSubmit(submit)}>
          <Text>PROXIMO</Text>
        </TouchableOpacity>
      </BaseView>
    </BaseSafeAreaView>
  );
};
