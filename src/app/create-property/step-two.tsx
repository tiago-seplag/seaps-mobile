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

type Props = StaticScreenProps<{
  organization_id: string;
}>;

export const StepTwoScreen = ({ route }: Props) => {
  const organization_id = route.params.organization_id;
  const navigation = useNavigation<CreatePropertyRoutesProps>();

  const [responsible, setResponsible] = useState<any[]>([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    api
      .get("/api/organizations/" + organization_id + "/responsible")
      .then(({ data }) => setResponsible(data));
  }, []);

  const submit = () => {
    navigation.push("StepThree");
  };

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <BaseView>
        <Row />
        <Card>
          <Select
            label="Responsável"
            placeholder="Selecione o Responsável do imóvel"
            control={control}
            errors={errors}
            name="person_id"
            errorMessage="Selecione o Responsável do imóvel"
            options={responsible}
            button={
              <TouchableOpacity>
                <MaterialIcons name="add" size={24} color={"#1a3180"} />
              </TouchableOpacity>
            }
          />
        </Card>
        <TouchableOpacity onPress={() => handleSubmit(submit)}>
          <Text>PROXIMO</Text>
        </TouchableOpacity>
      </BaseView>
    </BaseSafeAreaView>
  );
};
