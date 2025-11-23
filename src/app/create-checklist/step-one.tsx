import React, { useEffect, useState } from "react";

import { Select } from "../../components/form/select";
import { getOrganizations, getModels } from "../../services";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { Card } from "../../components/ui/card";
import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Header } from "../../components/ui/header";
import { StepsCount } from "../../components/steps-count";
import { Row } from "../../components/row";
import { FormButton } from "../../components/form/form-button";
import { CreateChecklistRoutesProps } from "./routes";
import { useForm } from "react-hook-form";
import { useChecklistStore } from "../../stores/createChecklistStore";
import { Input } from "../../components/form/input";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

type Props = StaticScreenProps<undefined>;

type Form = {
  organization_id: string;
  model_id: string;
  is_returned: string;
  return: number;
};

export function StepOneScreen(_: Props) {
  const { setChecklist } = useChecklistStore();

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);

  const navigation = useNavigation<CreateChecklistRoutesProps>();

  const {
    setValue,
    watch,
    clearErrors,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Form>();

  useEffect(() => {
    clearErrors();
    getOrganizations({ per_page: 100 }).then((response) =>
      setOrganizations(response.data)
    );
    getModels().then((response) => {
      setModels(response.data);
      setValue("model_id", response.data[0]?.id);
    });
  }, []);

  const submit = async (values: Form) => {
    setChecklist({ ...values, is_returned: values.is_returned === "true" });

    navigation.push("StepTwo", {
      organization_id: values.organization_id,
    });
  };

  const is_returned = watch("is_returned");

  useEffect(() => {
    if (is_returned === "false") {
      setValue("return", 0);
    }
  }, [is_returned]);

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR CHECKLIST"} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            />
            <Select
              options={[
                { id: "true", name: "Sim" },
                { id: "false", name: "Não" },
              ]}
              control={control}
              errors={errors}
              name="is_returned"
              label="CHECKLIST DE RETORNO:"
              placeholder="É um checklist de retorno?"
              errorMessage="Informe se é um checklist de retorno"
            />
            {is_returned === "true" && (
              <Input
                required={false}
                control={control}
                keyboardType="number-pad"
                errors={errors}
                name="return"
                label="QUAL RETORNO:"
                placeholder="Insira qual o retorno"
              />
            )}
          </Card>
          <FormButton
            onPress={handleSubmit(submit)}
            title="PRÓXIMO"
            icon="chevron-right"
          />
        </BaseView>
      </TouchableWithoutFeedback>
    </BaseSafeAreaView>
  );
}
