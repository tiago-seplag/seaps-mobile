import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../services/api";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChecklistRoutesPrams } from "./routes";

import Materialnicons from "@expo/vector-icons/MaterialIcons";
import RadioGroup from "../../components/RadioGroup";
import { Toast } from "toastify-react-native";
import { Header } from "../../components/ui/header";
import { ScoreBadge } from "../../components/score-badge";
import { Row } from "../../components/row";
import { Button } from "../../components/ui/button";

export function ChecklistItemScreen({ route }: any) {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChecklistRoutesPrams>>();

  const [checklist, setChecklist] = useState<Checklist>(route.params.checklist);
  const [checklistItem, setChecklistItem] = useState<ChecklistItem>(
    route.params.checklistItem
  );
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lock, setLock] = useState(false);

  const handlePressRadio = async (value: string, id: string) => {
    if (!lock) {
      setLock(true);
      await api
        .put("/api/checklist-item/" + id, { score: value })
        .then(() => {
          setChecklist((oldValue: any) => ({
            ...oldValue,
            checklistItems: oldValue.checklistItems.map((item: any) =>
              item.id === id ? { ...item, score: value } : item
            ),
          }));

          setChecklistItem((state) => ({ ...state, score: Number(value) }));
        })
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
      <View style={styles.flatList}>
        <View style={{ gap: 8 }}>
          <Text style={{ color: "#1A3180", fontSize: 16, fontWeight: 400 }}>
            PONTUAÇÃO:
          </Text>
          <View style={styles.card}>
            <RadioGroup
              radioButtons={radioButtons}
              containerStyle={{
                gap: 8,
              }}
              disabled={checklist?.status === "CLOSED"}
              onPress={(value) => handlePressRadio(value, checklistItem.id)}
              selectedId={String(checklistItem.score)}
            />
          </View>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "bold" },
  flatList: {
    flex: 1,
    gap: 16,
    padding: 16,
    backgroundColor: "#F1F2F4",
  },
  card: {
    display: "flex",
    padding: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "#c8ccda",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: "black",
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0E1B46",
  },
});

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
