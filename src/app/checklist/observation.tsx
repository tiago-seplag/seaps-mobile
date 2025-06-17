import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { api } from "../../services/api";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { ChecklistRoutesProps } from "./routes";
import { Toast } from "toastify-react-native";
import { Header } from "../../components/ui/header";
import { BaseSafeAreaView } from "../../components/skeleton";
import { Input } from "../../components/form/input";
import { useForm } from "react-hook-form";
import { Card } from "../../components/ui/card";
import { FormButton } from "../../components/form/form-button";

type Props = StaticScreenProps<{
  checklistItem: any;
  checklist: any;
}>;

export function ObservationScreen({ route }: Props) {
  const checklist = route.params.checklist;

  const navigation = useNavigation<ChecklistRoutesProps>();

  const [checklistItem] = useState<ChecklistItem>(route.params.checklistItem);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    observation: string;
  }>({
    defaultValues: {
      observation: route.params.checklistItem.observation,
    },
  });

  const handleUpdateObservation = async ({
    observation,
  }: {
    observation: string;
  }) => {
    await api
      .put("/api/checklist-item/" + checklistItem.id, {
        observation: observation,
      })
      .then(() =>
        navigation.popTo("ChecklistItem", {
          checklistItem,
          checklist,
          refresh: Date.now(),
        })
      )
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      });
  };

  return (
    <BaseSafeAreaView>
      <Header
        backButton
        title={checklistItem?.item?.name}
        style={{
          borderBottomColor:
            checklist?.status === "OPEN" ? "#067C03" : "#FD0006",
        }}
      />
      <KeyboardAwareScrollView
        bounces={false}
        contentContainerStyle={{
          flex: 1,
          padding: 16,
          backgroundColor: "#F1F2F4",
        }}
        enableAutomaticScroll={true}
      >
        <Card>
          <Input
            required={false}
            control={control}
            errors={errors}
            label="OBERSVAÇÃO:"
            name="observation"
            placeholder="Insira uma descrição da imagem"
            errorMessage="Insira o endereço do imóvel"
            maxLength={255}
            multiline
            disabled={route.params.checklist.status === "CLOSED"}
            style={{ minHeight: 44 * 3.1 }}
          />
        </Card>
        <FormButton
          icon="save"
          title="SALVAR"
          disabled={route.params.checklist.status === "CLOSED"}
          onPress={handleSubmit(handleUpdateObservation)}
        />
      </KeyboardAwareScrollView>
    </BaseSafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    flex: 1,
    borderColor: "#c8ccda",
    borderRadius: 16,
    gap: 8,
    backgroundColor: "#fff",
    shadowColor: "black",
    shadowOffset: {
      height: 2,
      width: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    borderRadius: 4,
    alignItems: "flex-start",
    objectFit: "cover",
    justifyContent: "flex-start",
    flex: 1,
  },
  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#c8ccda",
    textAlignVertical: "top",
    minHeight: 110,
  },
  iconButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderWidth: 1,
    borderColor: "#1A1A1A",
    borderRadius: 3,
    flex: 1,
  },
});
