import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  StaticScreenProps,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { ChecklistRoutesProps } from "./routes";
import { api } from "../../services/api";
import { Toast } from "toastify-react-native";

import { Label } from "../../components/Label";
import { PDFButtonModal } from "./components/pdf-button-modal";
import { Header } from "../../components/ui/header";
import { ChecklistBadge } from "../../components/checklist-badge";
import { Row } from "../../components/row";
import { getFirstAndLastName } from "../../utils";
import { Button } from "../../components/ui/button";
import {
  BaseSafeAreaView,
  BaseScrollView,
  BaseView,
} from "../../components/skeleton";
import { Card, CardHeader } from "../../components/ui/card";

type Props = StaticScreenProps<{
  checklist: any;
  id: string;
}>;

export function ChecklistScreen({ route }: Props) {
  const focus = useIsFocused();
  const navigation = useNavigation<ChecklistRoutesProps>();

  const [checklist, setChecklist] = useState<Checklist>(route.params.checklist);
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
    setLoading(true);
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
      })
      .finally(() => setLoading(false));
  };

  const reopenChecklist = async () => {
    setLoading(true);
    await api
      .post("/api/checklists/" + route.params?.id + "/re-open")
      .then(() => getData())
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      })
      .finally(() => setLoading(false));
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

  return (
    <BaseSafeAreaView>
      <Header
        backButton
        title={checklist?.property.name}
        style={{
          borderBottomColor:
            checklist?.status === "OPEN" ? "#067C03" : "#FD0006",
        }}
      />
      {loading || !checklist ? (
        <BaseView>
          <ActivityIndicator size={"large"} />
        </BaseView>
      ) : (
        <BaseScrollView
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={getData} />
          }
        >
          <Card style={styles.shadow}>
            <CardHeader>
              <Text style={styles.cardSid}>{checklist?.sid}</Text>
              <ChecklistBadge status={checklist?.status} />
            </CardHeader>
            <View style={{ display: "flex", gap: 8 }}>
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
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
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
              <Label
                title="PONTUAÇÃO"
                value={
                  checklist.status === "CLOSED"
                    ? checklist?.score.toFixed(2)
                    : "--"
                }
              />
            </View>
          </Card>
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
                  checklist: checklist,
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
        </BaseScrollView>
      )}
    </BaseSafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardSid: {
    color: "#485A99",
    fontFamily: "MonoBold",
    fontWeight: "bold",
    fontSize: 18,
  },
  shadow: {
    shadowColor: "#000000",
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
  },
});
