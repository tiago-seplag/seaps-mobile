import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { api } from "../../services/api";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { ChecklistRoutesProps } from "./routes";

import RadioGroup from "../../components/RadioGroup";
import { Toast } from "toastify-react-native";
import { Header } from "../../components/ui/header";
import { Row } from "../../components/row";
import { Button } from "../../components/ui/button";
import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Card } from "../../components/ui/card";

type Props = StaticScreenProps<{
  checklistItem: any;
  checklist: any;
  refresh?: number;
}>;

export function ChecklistItemScreen({ route }: Props) {
  const navigation = useNavigation<ChecklistRoutesProps>();

  const checklist = route.params.checklist;

  const [checklistItem, setChecklistItem] = useState<ChecklistItem>(
    route.params.checklistItem
  );
  const [lock, setLock] = useState(false);

  const handlePressRadio = async (value: string, id: string) => {
    if (!lock) {
      setLock(true);
      await api
        .put("/api/v1/checklist-item/" + id, { score: value })
        .then(({ data }) =>
          setChecklistItem((prev) => ({
            ...prev,
            ...data,
          }))
        )
        .catch((e) => {
          if (e.response?.data?.message) {
            Toast.error(e.response.data.message);
          }
        })
        .finally(() => setLock(false));
    }
  };

  const handleNavigateToImages = () => {
    navigation.push("Photos", {
      checklist,
      checklistItem,
    });
  };

  const handleNavigateToObservation = () => {
    navigation.push("Observation", {
      checklist,
      checklistItem,
    });
  };

  useEffect(() => {
    const getData = async () => {
      await api
        .get("/api/v1/checklist-item/" + checklistItem.id)
        .then(({ data }) =>
          setChecklistItem((prev) => ({
            ...prev,
            observation: data.observation,
          }))
        )
        .catch((e) => {
          if (e.response?.data?.message) {
            Toast.error(e.response.data.message);
          }
        });
    };

    if (route.params?.refresh) {
      getData();
    }
  }, [route.params?.refresh]);

  return (
    <BaseSafeAreaView>
      <Header
        backButton
        title={checklistItem.item?.name}
        style={{
          borderBottomColor:
            checklist?.status === "OPEN" ? "#067C03" : "#FD0006",
        }}
      />
      <BaseView style={{ gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ color: "#1A3180", fontSize: 16, fontWeight: 400 }}>
            PONTUAÇÃO:
          </Text>
          <Card>
            <RadioGroup
              radioButtons={radioButtons}
              containerStyle={{
                gap: 8,
              }}
              disabled={checklist?.status === "CLOSED"}
              onPress={(value) => handlePressRadio(value, checklistItem.id)}
              selectedId={String(checklistItem.score)}
            />
          </Card>
        </View>
        <Row />
        <View style={{ gap: 8 }}>
          <Text style={{ color: "#1A3180", fontSize: 16, fontWeight: 400 }}>
            AÇÕES:
          </Text>
          <Button
            icon="photo-library"
            title="IMAGENS"
            text="Listar imagens do ITEM"
            onPress={handleNavigateToImages}
          />
          <Button
            icon="sms"
            title="OBSERVAÇÕES"
            text="Observações gerais sobre o ITEM"
            onPress={handleNavigateToObservation}
          />
        </View>
      </BaseView>
    </BaseSafeAreaView>
  );
}

const radioButtonStyles = {
  height: 54,
  padding: 10,
  borderWidth: 1,
  borderRadius: 12,
  marginHorizontal: 0,
  margin: 0,
};

const radioButtons = [
  {
    id: "3",
    color: "#22C55E",
    backgroundColor: "#22C55E",
    label: "BOM",
    value: "3",
    containerStyle: {
      borderColor: "#22C55E",
      ...radioButtonStyles,
    },
  },
  {
    id: "1",
    color: "#EAB308",
    backgroundColor: "#EAB308",
    label: "REGULAR",
    value: "1",
    containerStyle: {
      borderColor: "#EAB308",
      ...radioButtonStyles,
    },
  },
  {
    id: "-2",
    label: "RUIM",
    value: "-2",
    color: "#DC2626",
    backgroundColor: "#DC2626",
    containerStyle: {
      borderColor: "#DC2626",
      ...radioButtonStyles,
    },
  },
  {
    id: "0",
    color: "#7D848F",
    backgroundColor: "#7D848F",
    label: "NÃO SE APLICA",
    value: "0",
    containerStyle: {
      borderColor: "#7D848F",
      ...radioButtonStyles,
    },
  },
];
