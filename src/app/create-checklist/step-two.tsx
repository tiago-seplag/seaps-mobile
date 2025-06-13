import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";

import { useCreateChecklist } from "../../contexts/checklistContext";
import { Input } from "../../components/form/input";
import { Header } from "../../components/ui/header";
import { Card } from "../../components/ui/card";
import { FormButton } from "../../components/form/form-button";
import { BaseSafeAreaView, BaseView } from "../../components/skeleton";

import { api } from "../../services/api";

import { PropertyItem } from "./components/property-item";
import { CreateChecklistRoutesProps } from "./routes";
import { Select } from "../../components/form/select";
import { CreateButton } from "../../components/create-button";
import { useChecklistStore } from "../../stores/createChecklistStore";
import { StepsCount } from "../../components/steps-count";
import { Row } from "../../components/row";

interface ChecklistForm {
  name?: string;
  property_id: string;
}

type Props = StaticScreenProps<{
  organization_id: string;
}>;

export function StepTwoScreen({ route }: Props) {
  const { setChecklist } = useChecklistStore();

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChecklistForm>();
  const [properties, setProperties] = useState<Property[]>([]);

  const screen = useNavigation<CreateChecklistRoutesProps>();
  const navigation = useNavigation();

  useEffect(() => {
    api
      .get("/api/organizations/" + route.params.organization_id + "/properties")
      .then(({ data }) => setProperties(data));
  }, []);

  const submit = async (values: ChecklistForm) => {
    setChecklist((prev) => ({ ...prev, property_id: values.property_id }));
    screen.push("StepThree");
  };

  const property_id = watch("property_id");
  const name = watch("name");

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR CHECKLIST"} />
      <BaseView style={{ gap: 16, flex: 1 }}>
        <StepsCount step={2} length={3} />
        <Row />
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Card style={{ gap: 16, flex: 1 }}>
              <View style={{ display: "none" }}>
                <Select
                  label="Responsável"
                  placeholder="Selecione o Responsável do imóvel"
                  control={control}
                  errors={errors}
                  name="property_id"
                  errorMessage="Selecione o Responsável do imóvel"
                  options={properties}
                />
              </View>
              <Input
                required={false}
                control={control}
                errors={errors}
                label="IMÓVEL"
                name="name"
                placeholder="Procure pelo nome do imóvel"
                errorMessage="Insira o nome do imóvel"
              />
              <FlatList
                data={
                  name
                    ? properties.filter((item) => item.name.startsWith(name))
                    : properties
                }
                ListFooterComponent={
                  <CreateButton
                    title="CRIAR IMÓVEL"
                    onPress={() =>
                      navigation.navigate("CreateProperty", {
                        screen: "StepOne",
                        params: {
                          organization_id: route.params.organization_id,
                        },
                      })
                    }
                  />
                }
                renderItem={(item) => (
                  <PropertyItem
                    selected={property_id === item.item.id}
                    item={item}
                    onSelect={() =>
                      property_id === item.item.id
                        ? reset()
                        : setValue("property_id", item.item.id)
                    }
                  />
                )}
              />
              {errors["property_id"] ? (
                <Text
                  style={{
                    color: "#f75656",
                    marginLeft: 8,
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  * Selecione um imóvel
                </Text>
              ) : null}
            </Card>
          </TouchableWithoutFeedback>
          <FormButton
            onPress={handleSubmit(submit)}
            title="PRÓXIMO"
            icon="chevron-right"
          />
        </KeyboardAvoidingView>
      </BaseView>
    </BaseSafeAreaView>
  );
}
