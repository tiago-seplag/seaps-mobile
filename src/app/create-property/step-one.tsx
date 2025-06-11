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

type Props = StaticScreenProps<{
  organization_id?: string;
}>;

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
      organization_id: route.params.organization_id,
    },
  });

  useEffect(() => {
    api.get("/api/organizations").then(({ data }) => setOrganizations(data));
  }, [focus]);

  const submit = (values: PropertyForm) => {
    navigation.push("StepTwo", { organization_id: values.organization_id });
  };

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <BaseView>
        <Row />
        <Card>
          <Select
            options={organizations}
            control={control}
            errors={errors}
            name="organization_id"
            label="Orgão"
            placeholder="Selecione o orgão"
            errorMessage="Insira o orgão do imóvel"
          />
          <Select
            label="Tipo de Imóvel"
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
        <TouchableOpacity onPress={() => handleSubmit(submit)}>
          <Text>PROXIMO</Text>
        </TouchableOpacity>
      </BaseView>
    </BaseSafeAreaView>
  );
};
