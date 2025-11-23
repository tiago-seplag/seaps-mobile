import { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  StackActions,
  StaticScreenProps,
  useNavigation,
} from "@react-navigation/native";
import { useForm } from "react-hook-form";

import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Card } from "../../components/ui/card";
import { Header } from "../../components/ui/header";
import { Row } from "../../components/row";

import { StepsCount } from "../../components/steps-count";
import { FormButton } from "../../components/form/form-button";
import { Select } from "../../components/form/select";
import { getFirstAndLastName } from "../../utils";

import { useSession } from "../../contexts/authContext";
import { createChecklist, getUsers } from "../../services";
import { useChecklistStore } from "../../stores/createChecklistStore";

type Props = StaticScreenProps<undefined>;

export const StepThreeScreen = (_: Props) => {
  const { checklist } = useChecklistStore();

  const { user } = useSession();
  const navigation = useNavigation();

  const [users, setUsers] = useState<any[]>([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: user.id,
    },
  });

  const submit = async (values: any) => {
    try {
      await createChecklist({
        ...checklist,
        ...values,
        return: Number(checklist.return) || 0,
        is_returned: Boolean(checklist.is_returned),
      });
      navigation.dispatch(
        StackActions.popTo("HomeRoutes", {
          screen: "ChecklistsHomeScreen",
          params: {
            refresh: Date.now(),
          },
        })
      );
    } catch (e: any) {
      console.log(e.response?.data);
    }
  };

  useEffect(() => {
    getUsers({ role: "evaluator" }).then((response) => setUsers(response.data));
  }, []);

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR CHECKLIST"} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BaseView style={{ gap: 16 }}>
          <StepsCount step={3} length={3} />
          <Row />
          <Card style={{ paddingVertical: 14, gap: 16 }}>
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
