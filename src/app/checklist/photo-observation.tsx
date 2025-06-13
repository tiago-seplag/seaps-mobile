import { useState } from "react";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Toast } from "toastify-react-native";

import { api } from "../../services/api";
import { Card } from "../../components/ui/card";
import { BaseSafeAreaView } from "../../components/skeleton";
import { FormButton } from "../../components/form/form-button";
import { Input } from "../../components/form/input";

import { ImageCard } from "./components/image-card";

import { ChecklistRoutesProps } from "./routes";

interface ChecklistItemImage {
  checklist_item_id: string;
  created_at: string;
  id: string;
  image: string;
  observation: string;
}

type Props = StaticScreenProps<{
  checklistItemPhoto: any;
  checklist: any;
}>;

export function PhotoObservationScreen({ route }: Props) {
  const navigation = useNavigation<ChecklistRoutesProps>();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    observation: string;
  }>();

  const [image] = useState<ChecklistItemImage>(route.params.checklistItemPhoto);

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
          image.checklist_item_id +
          "/images/" +
          image.id,
        {
          observation: observation,
        }
      )
      .then(() => navigation.goBack())
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <BaseSafeAreaView>
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
          <ImageCard uri={image.image} />
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
            style={{ minHeight: 44 * 3.1 }}
          />
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
