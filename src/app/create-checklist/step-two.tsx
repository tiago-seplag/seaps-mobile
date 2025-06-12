import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useChecklistForm } from "../../contexts/checklistContext";
import { Input } from "../../components/form/input";
import { Header } from "../../components/ui/header";
import { Card } from "../../components/ui/card";
import { FormButton } from "../../components/form/form-button";
import { BaseSafeAreaView } from "../../components/skeleton";

import { api } from "../../services/api";

import Materialnicons from "@expo/vector-icons/MaterialIcons";
import { PropertyItem } from "./components/property-item";
import { CreateChecklistRoutesProps } from "./routes";
import { Select } from "../../components/form/select";
import { CreateButton } from "../../components/create-button";

interface ChecklistForm {
  model_id: string;
  organization_id: string;
  property_id: string;
  user_id: string;
}

type Props = StaticScreenProps<{
  organization_id: string;
}>;

export function StepTwoScreen({ route }: Props) {
  const { control, watch } = useForm();
  const { form, setChecklist, checklist, reset } = useChecklistForm();
  const [properties, setProperties] = useState<Property[]>([]);

  const screen = useNavigation<CreateChecklistRoutesProps>();
  const navigation = useNavigation();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    api
      .get("/api/organizations/" + route.params.organization_id + "/properties")
      .then(({ data }) => setProperties(data));
  }, []);

  useEffect(() => {
    api
      .get("/api/organizations/" + route.params.organization_id + "/properties")
      .then(({ data }) => setProperties(data));
  }, []);

  const submit = async (values: ChecklistForm) => {
    if (!checklist?.property?.id) {
      form.setError("property_id", {
        type: "required",
      });
      return;
    }

    const data = {
      ...values,
    };

    form.reset({});
    reset();

    return api
      .post("/api/checklists", data)
      .then(() => screen.push("StepOne"))
      .catch((e) => console.log(e));
  };

  const property_id = watch("property_id");
  const name = watch("name");

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Card style={{ gap: 16, flex: 1 }}>
            <View style={{ display: "none" }}>
              <Select
                label="Responsável"
                placeholder="Selecione o Responsável do imóvel"
                control={control}
                errors={errors}
                name="person_id"
                errorMessage="Selecione o Responsável do imóvel"
                options={properties}
              />
            </View>
            <Input
              control={control}
              errors={errors}
              label="Filtro"
              name="name"
              placeholder="Procure pelo nome do local"
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
                        organization_id: checklist.id,
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
          <FormButton
            onPress={handleSubmit(submit)}
            title="PRÓXIMO"
            icon="chevron-right"
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BaseSafeAreaView>
  );
}
