import { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";

import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Card } from "../../components/ui/card";
import { Header } from "../../components/ui/header";
import { Row } from "../../components/row";
import { Input } from "../../components/form/input";

import { StepsCount } from "../../components/steps-count";
import { FormButton } from "../../components/form/form-button";
import { Select } from "../../components/form/select";
import { getFirstAndLastName } from "../../utils";

import { useSession } from "../../contexts/authContext";
import { api } from "../../services/api";

type Props = StaticScreenProps<undefined>;

export const StepThreeScreen = (_: Props) => {
  const { user } = useSession();
  const navigation = useNavigation();

  const [users, setUsers] = useState<any[]>([]);

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
          screen: "ChecklistsHomeScreen",
          params: {
            refresh: true,
          },
        })
      )
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    api.get("/api/users").then(({ data }) => setUsers(data));
  }, []);

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BaseView style={{ gap: 16 }}>
          <StepsCount step={3} length={3} />
          <Row />
          <Card>
            <Select
              options={users.map((user) => ({
                ...user,
                name: getFirstAndLastName(user.name),
              }))}
              defaultValue={user.id}
              control={control}
              errors={errors}
              name="user_id"
              label="RESPONSÁVEL PELO CHECKLIST:"
              placeholder="Selecione um responsável"
              errorMessage="Selecione o responsável do checklist"
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
