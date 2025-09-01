import { Alert, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";

import { Header } from "../../components/ui/header";
import { Row } from "../../components/row";
import { Button } from "../../components/ui/button";
import { BaseScrollView } from "../../components/skeleton";

import { ChecklistRoutesProps } from "./routes";
import { Card, CardText } from "../../components/ui/card";
import { useState } from "react";
import { api } from "../../services/api";
import { Toast } from "toastify-react-native";

type Props = StaticScreenProps<{
  checklistItem: any;
  checklistItemPhoto: any;
  checklist: any;
}>;

export function PhotoScreen({ route }: Props) {
  const navigation = useNavigation<ChecklistRoutesProps>();

  const [loading, setLoading] = useState(false);

  const checklist = route.params.checklist;
  const checklistItem = route.params.checklistItem;
  const checklistItemPhoto = route.params.checklistItemPhoto;

  const handleNavigateToObservation = () => {
    navigation.push("PhotoObservation", {
      checklist,
      checklistItemPhoto: checklistItemPhoto,
      checklistItem: checklistItem,
    });
  };

  const handleDeleteImage = () => {
    Alert.alert(
      "Você tem certeza absoluta?",
      "Esta ação não pode ser desfeita. Isso excluirá permanentemente essa imagem.",
      [
        {
          text: "Não",
          onPress: () => "",
          isPreferred: true,
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => onDeleteImage(),
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  async function onDeleteImage() {
    setLoading(true);

    await api
      .delete(
        "/api/v1/checklist-item/" +
          checklistItem.id +
          "/images/" +
          checklistItemPhoto.id
      )
      .then(() => {
        Toast.success("Imagem deletada com sucesso");
        navigation.goBack();
      })
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      })
      .finally(() => setLoading(false));
  }

  async function handleUpdateChecklistImage() {
    api
      .put("/api/v1/checklist-item/" + checklistItem.id, {
        image: checklistItemPhoto.image,
      })
      .then(() => {
        Toast.success("Item atulizado com sucesso");
        navigation.pop();
      })
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      });
  }

  const getData = async () => {
    setLoading(true);
    api
      .get("/api/v1/checklist-item/" + checklistItem.id)
      //   .then(({ data }) => setChecklistItem(data))
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a3280" }}>
      <Header
        backButton
        title={checklistItem.item?.name}
        style={{
          borderBottomColor:
            checklist?.status === "OPEN" ? "#067C03" : "#FD0006",
        }}
      />
      <BaseScrollView>
        <View style={{ gap: 16 }}>
          <Card style={{ gap: 8 }}>
            <Image
              source={{
                uri: process.env.EXPO_PUBLIC_BUCKET_URL + checklistItemPhoto.image,
              }}
              style={{
                height: 298,
                width: "auto",
                objectFit: "cover",
                flex: 1,
                backgroundColor: "#D9D9D9",
                borderRadius: 8,
              }}
            />
            <CardText
              numberOfLines={3}
              style={{ fontSize: 14, fontWeight: "bold" }}
            >
              {checklistItemPhoto.observation}
            </CardText>
          </Card>
          <Row />
          <View style={{ gap: 8 }}>
            <Text style={{ color: "#1A3180", fontSize: 16, fontWeight: 400 }}>
              AÇÕES:
            </Text>
            <Button
              icon="sms"
              title="EDITAR OBSERVAÇÕES"
              onPress={handleNavigateToObservation}
            />
            <Button
              disabled={
                checklistItem?.image === checklistItemPhoto?.image ||
                route.params.checklist.status === "CLOSED"
              }
              icon="star"
              color="#EAB308"
              title="TORNAR PRINCIPAL"
              onPress={handleUpdateChecklistImage}
            />
            <Button
              disabled={route.params.checklist.status === "CLOSED"}
              icon="delete"
              color="#DC2626"
              title="DELETAR IMAGEM"
              onPress={handleDeleteImage}
            />
          </View>
        </View>
      </BaseScrollView>
    </SafeAreaView>
  );
}
