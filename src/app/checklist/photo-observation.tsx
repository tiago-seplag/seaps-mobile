import { useState } from "react";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Toast } from "toastify-react-native";

import { api } from "../../services/api";
import { Card, CardText } from "../../components/ui/card";
import { BaseSafeAreaView } from "../../components/skeleton";
import { FormButton } from "../../components/form/form-button";
import { Input } from "../../components/form/input";

import { ImageCard } from "./components/image-card";

import { ChecklistRoutesProps } from "./routes";
import { Header } from "../../components/ui/header";
import { View } from "react-native";

interface ChecklistItemImage {
  checklist_item_id: string;
  created_at: string;
  id: string;
  image: string;
  observation: string;
}

type Props = StaticScreenProps<{
  checklistItemPhoto: any;
  checklistItem: any;
  checklist: any;
}>;

export function PhotoObservationScreen({ route }: Props) {
  const navigation = useNavigation<ChecklistRoutesProps>();

  const checklist = route.params.checklist;
  const checklistItem = route.params.checklistItem;
  const checklistItemPhoto = route.params.checklistItemPhoto;

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<{
    observation: string;
  }>({
    defaultValues: {
      observation: checklistItemPhoto.observation,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleUpdateObservation = async ({
    observation,
  }: {
    observation?: string;
  }) => {
    setLoading(true);
    await api
      .put(
        "/api/checklist-item/" +
          checklistItemPhoto.checklist_item_id +
          "/images/" +
          checklistItemPhoto.id,
        {
          observation: observation,
        }
      )
      .then(() => navigation.pop(2))
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const observation = watch("observation");

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
        <Card style={{ gap: 16 }}>
          <ImageCard uri={checklistItemPhoto.image} />
          <View>
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
              disabled={loading || route.params.checklist.status === "CLOSED"}
              style={{ minHeight: 44 * 3.1 }}
            />
            <CardText style={{ alignSelf: "flex-end", marginRight: 8 }}>
              {Math.max(observation?.length, 0)}/255
            </CardText>
          </View>
        </Card>
        <FormButton
          icon="save"
          title="SALVAR"
          disabled={loading || route.params.checklist.status === "CLOSED"}
          onPress={handleSubmit(handleUpdateObservation)}
        />
      </KeyboardAwareScrollView>
    </BaseSafeAreaView>
  );
}
