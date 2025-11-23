import { useEffect, useState } from "react";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";

import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Card } from "../../components/ui/card";
import { Select } from "../../components/form/select";
import { getOrganizations } from "../../services";
import { CreatePropertyRoutesProps } from "./route";
import { Header } from "../../components/ui/header";
import { Row } from "../../components/row";

import { StepsCount } from "../../components/steps-count";
import { FormButton } from "../../components/form/form-button";
import { usePropertyStore } from "../../stores/createPropertyStore";

type Props = StaticScreenProps<
  | {
      organization_id?: string;
      origin?: string;
    }
  | undefined
>;

interface PropertyForm {
  organization_id: string;
  type: string;
}

export const StepOneScreen = ({ route }: Props) => {
  const { setProperty } = usePropertyStore();

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
    getOrganizations({ per_page: 100 })
      .then((response) => setOrganizations(response.data));
  }, []);

  const submit = (values: PropertyForm) => {
    setProperty(values);
    navigation.push("StepTwo", {
      organization_id: values.organization_id,
      origin: route.params?.origin,
    });
  };

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <BaseView style={{ gap: 16, flex: 1 }}>
        <StepsCount step={1} length={3} />
        <Row />
        <Card style={{ paddingVertical: 14, gap: 16 }}>
          <Select
            disabled={!!route.params?.organization_id}
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
        <FormButton
          onPress={handleSubmit(submit)}
          title="PRÓXIMO"
          icon="chevron-right"
        />
      </BaseView>
    </BaseSafeAreaView>
  );
};
