import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";

import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Card } from "../../components/ui/card";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Header } from "../../components/ui/header";
import { Row } from "../../components/row";
import { Input } from "../../components/form/input";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { api } from "../../services/api";
import { StepsCount } from "../../components/steps-count";

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BaseView style={{ gap: 16 }}>
          <StepsCount step={3} length={3} />
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
              maxLength={255}
              multiline
              style={{ minHeight: 44 * 3.1 }}
            />
          </Card>
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
              SALVAR
            </Text>
            <MaterialIcons name={"save"} size={32} color={"#FEFEFE"} />
          </TouchableOpacity>
        </BaseView>
      </TouchableWithoutFeedback>
    </BaseSafeAreaView>
  );
};
