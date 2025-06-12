import { useEffect, useState } from "react";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";

import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Card } from "../../components/ui/card";
import { Select } from "../../components/form/select";
import { api } from "../../services/api";
import { CreatePropertyRoutesProps } from "./route";
import { Text, TouchableOpacity } from "react-native";
import { Header } from "../../components/ui/header";
import { Row } from "../../components/row";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StepsCount } from "../../components/steps-count";

type Props = StaticScreenProps<
  | {
      organization_id?: string;
    }
  | undefined
>;

interface PropertyForm {
  organization_id: string;
  type: string;
}

export const StepOneScreen = ({ route }: Props) => {
  const navigation = useNavigation<CreatePropertyRoutesProps>();

  const [organizations, setOrganizations] = useState<any[]>([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PropertyForm>({
    defaultValues: {
      organization_id: route.params?.organization_id,
    },
  });

  useEffect(() => {
    api.get("/api/organizations").then(({ data }) => setOrganizations(data));
  }, []);

  const submit = (values: PropertyForm) => {
    console.log(values);
    navigation.push("StepTwo", { organization_id: values.organization_id });
  };

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <BaseView style={{ gap: 16, flex: 1 }}>
        <StepsCount step={1} length={3} />
        <Row />
        <Card style={{ paddingVertical: 14, gap: 16 }}>
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
            PROXIMO
          </Text>
          <MaterialIcons name={"chevron-right"} size={32} color={"#FEFEFE"} />
        </TouchableOpacity>
      </BaseView>
    </BaseSafeAreaView>
  );
};
