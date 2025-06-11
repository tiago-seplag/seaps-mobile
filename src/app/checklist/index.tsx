import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChecklistRoutesPrams } from "./routes";
import { api } from "../../services/api";
import { Toast } from "toastify-react-native";

import { Badge } from "../../components/CardBadge";
import { Label } from "../../components/Label";
import { PDFButtonModal } from "./PDFButtonModal";
import { Header } from "../../components/ui/header";
import { ChecklistBadge } from "../../components/checklist-badge";
import { Row } from "../../components/row";
import { getFirstAndLastName } from "../../utils";
import { Button } from "../../components/ui/button";

export function ChecklistScreen({ route }: any) {
  const focus = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<ChecklistRoutesPrams>>();

  const [checklist, setChecklist] = useState<Checklist>();
  const [loading, setLoading] = useState(true);

  const getData = () => {
    api
      .get("/api/checklists/" + route.params?.id)
      .then(({ data }) => {
        setChecklist(data);
      })
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (focus) {
      getData();
    }
  }, [focus]);

  const handleFinishChecklist = () => {
    Alert.alert(
      "Deseja finalizar o checklist?",
      "",
      [
        {
          text: "Sim",
          onPress: () => finishChecklist(),
        },
        {
          text: "Não",
          onPress: () => "",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => 0,
      }
    );
  };

  const finishChecklist = async () => {
    await api
      .put("/api/checklists/" + route.params?.id + "/finish")
      .then(() => getData())
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
        if (e.response.data.action) {
          Toast.error(e.response.data.action);
        }
      });
  };

  const reopenChecklist = async () => {
    await api
      .post("/api/checklists/" + route.params?.id + "/re-open")
      .then(() => getData())
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      });
  };

  const handleReopenChecklist = () => {
    Alert.alert(
      "Deseja reabrir o checklist?",
      "",
      [
        {
          text: "Sim",
          onPress: () => reopenChecklist(),
        },
        {
          text: "Não",
          onPress: () => "",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => 0,
      }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1a3280" }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <ActivityIndicator />
        </View>
        <View style={styles.flatList}>
          <ActivityIndicator size={"large"} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a3280" }}>
      <Header
        backButton
        title={checklist?.property.name}
        style={{
          borderBottomColor:
            checklist?.status === "OPEN" ? "#067C03" : "#FD0006",
        }}
      />
      <ScrollView
        style={styles.flatList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getData} />
        }
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 8,
            display: "flex",
            justifyContent: "space-between",
            shadowColor: "#000000",
            shadowRadius: 3,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.3,
          }}
        >
          <View style={{ display: "flex", gap: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                paddingBottom: 4,
              }}
            >
              <Text style={styles.cardSid}>{checklist?.sid}</Text>
              <ChecklistBadge status={checklist?.status} />
            </View>
            <Label title="ORGÃO" value={checklist?.organization.name} />
            <Label title="LOCAL" value={checklist?.property.name} />
            <Label
              title="RESPONSÁVEL PELO IMÓVEL"
              value={checklist?.property.person?.name}
            />
            <Label title="IMÓVEL" value={checklist?.property.name} />
            <Label title="ENDEREÇO" value={checklist?.property.address} />
            <Row />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Label
                title="CRIADO EM"
                value={new Date(
                  checklist?.created_at || ""
                ).toLocaleDateString()}
                style={{ flex: 1 }}
              />
              <Label
                style={{ flex: 1 }}
                title="FINALIZADO EM"
                value={
                  checklist?.finished_at
                    ? new Date(checklist?.finished_at).toLocaleDateString()
                    : "--"
                }
              />
            </View>
            <Label
              title="RESPONSÁVEL PELO CHECKLIST"
              value={getFirstAndLastName(checklist?.user?.name)}
            />
            <Label title="PONTUAÇÃO" value={checklist?.score} />
          </View>
        </View>
        <View style={{ gap: 12, marginTop: 16 }}>
          <Text style={{ color: "#1A3180", fontSize: 16, fontWeight: 400 }}>
            AÇÕES:
          </Text>
          <Button
            icon="add-task"
            title="ITENS"
            text="Listar itens do checklist"
            onPress={() =>
              navigation.push("ChecklistItems", {
                checklist,
              })
            }
          />
          <PDFButtonModal
            disabled={checklist?.status === "OPEN"}
            checklist={checklist}
            id={checklist?.id}
          />
          <Button
            icon="check"
            title={checklist?.status === "OPEN" ? "FINALIZAR" : "REABRIR"}
            text={
              checklist?.status === "OPEN"
                ? "Finalizar o checklist"
                : "Reabrir o checklist para alterações"
            }
            onPress={() =>
              checklist?.status === "OPEN"
                ? handleFinishChecklist()
                : handleReopenChecklist()
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F1F2F4",
  },
  cardSid: {
    color: "#485A99",
    fontFamily: "MonoBold",
    fontWeight: "bold",
    fontSize: 18,
  },
  button: {
    paddingVertical: 12,
    minHeight: 50,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
