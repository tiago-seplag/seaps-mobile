import { useCallback, useEffect, useState } from "react";
import {
  StaticScreenProps,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useForm } from "react-hook-form";

import {
  FlatList,
  Keyboard,
  RefreshControl,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Card } from "../../components/ui/card";
import { Header } from "../../components/ui/header";
import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Row } from "../../components/row";
import { CreateButton } from "../../components/create-button";
import { StepsCount } from "../../components/steps-count";

import { Input } from "../../components/form/input";
import { Select } from "../../components/form/select";
import { FormButton } from "../../components/form/form-button";

import { api } from "../../services/api";
import { usePropertyStore } from "../../stores/createPropertyStore";

import { CreatePropertyRoutesProps } from "./route";
import { PersonItem } from "./components/person-item";

type Props = StaticScreenProps<{ organization_id: string; origin?: string }>;

export const StepTwoScreen = ({ route }: Props) => {
  const { setProperty } = usePropertyStore();

  const organization_id = route.params.organization_id;
  const isFocused = useIsFocused();
  const navigation = useNavigation<CreatePropertyRoutesProps>();

  const [responsible, setResponsible] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ person_id: string }>({
    defaultValues: {
      person_id: undefined,
    },
  });

  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get("/api/organizations/" + organization_id + "/responsible")
      .then(({ data }) => setResponsible(data))
      .finally(() => setLoading(false));
  }, [organization_id]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const submit = (values: any) => {
    setProperty((prev) => ({ ...prev, person_id: values.person_id }));
    navigation.push("StepThree", {
      origin: route.params?.origin,
    });
  };

  const person_id = watch("person_id");

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BaseView style={{ gap: 16 }}>
          <StepsCount step={2} length={3} />
          <Row />
          <Card style={{ gap: 16, flex: 1 }}>
            <View style={{ display: "none" }}>
              <Select
                label="Responsável"
                placeholder="Selecione o Responsável do imóvel"
                control={control}
                errors={errors}
                name="person_id"
                errorMessage="Selecione o Responsável do imóvel"
                options={responsible}
              />
            </View>
            <Input
              control={control}
              errors={errors}
              label="RESPONSÁVEL:"
              name="name"
              placeholder="Procurar responsável"
              required={false}
              onChangeText={(e) => setFilter(e)}
            />
            <FlatList
              data={
                filter
                  ? responsible.filter((res) => res.name.startsWith(filter))
                  : responsible
              }
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={fetchData} />
              }
              renderItem={(item) => (
                <PersonItem
                  selected={person_id === item.item.id}
                  item={item}
                  onSelect={() =>
                    person_id === item.item.id
                      ? reset()
                      : setValue("person_id", item.item.id)
                  }
                />
              )}
              ListFooterComponent={() => (
                <CreateButton
                  title="CRIAR RESPONSÁVEL"
                  onPress={() =>
                    navigation.push("CreateResponsible", {
                      organization_id: organization_id,
                    })
                  }
                />
              )}
              style={{ flex: 1 }}
            />
            {errors["person_id"] ? (
              <Text
                style={{
                  color: "#f75656",
                  marginLeft: 8,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                * Selecione o Responsável do imóvel
              </Text>
            ) : null}
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
};
