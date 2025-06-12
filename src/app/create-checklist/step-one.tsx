import React, { useEffect, useState } from "react";

import { Select } from "../../components/form/select";
import { api } from "../../services/api";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useChecklistForm } from "../../contexts/checklistContext";
import { Card } from "../../components/ui/card";
import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Header } from "../../components/ui/header";
import { StepsCount } from "../../components/steps-count";
import { Row } from "../../components/row";
import { FormButton } from "../../components/form/form-button";
import { CreateChecklistRoutesProps } from "./routes";

type Props = StaticScreenProps<undefined>;

export function StepOneScreen(_: Props) {
  const { form, setChecklist } = useChecklistForm();

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);

  const navigation = useNavigation<CreateChecklistRoutesProps>();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    form.clearErrors();
    api.get("/api/organizations").then(({ data }) => setOrganizations(data));
    api.get("/api/models").then(({ data }) => setModels(data));
  }, []);

  const submit = async (values: { organization_id: string }) => {
    navigation.push("StepTwo", {
      organization_id: values.organization_id,
    });
  };

  const onCloseOrganizationSelect = () => {
    const organization_id = form.getValues("organization_id");

    const organization = organizations.find(
      (item) => item.id === organization_id
    );

    setChecklist((prev: any) => ({ ...prev, organization }));
  };

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <BaseView style={{ gap: 16, flex: 1 }}>
        <StepsCount step={1} length={3} />
        <Row />
        <Card style={{ paddingVertical: 14, gap: 16 }}>
          <Select
            options={models}
            control={control}
            errors={errors}
            name="model_id"
            label="MODELO:"
            placeholder="Selecione um modelo"
            errorMessage="Selecione o modelo do checklist"
          />
          <Select
            options={organizations}
            control={control}
            errors={errors}
            name="organization_id"
            label="ORGÃO:"
            placeholder="Selecione um orgão"
            errorMessage="Selecione o orgão do checklist"
            onClose={onCloseOrganizationSelect}
          />
          <FormButton
            onPress={handleSubmit(submit)}
            title="PRÓXIMO"
            icon="chevron-right"
          />
        </Card>
      </BaseView>
    </BaseSafeAreaView>
  );
}
