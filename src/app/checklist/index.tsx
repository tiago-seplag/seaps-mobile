import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChecklistRoutesPrams } from "./routes";
import { api } from "../../services/api";
import ToastManager, { Toast } from "toastify-react-native";

import { Badge } from "../../components/CardBadge";
import { Label } from "../../components/Label";

export function ChecklistScreen({ route }: any) {
  const focus = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<ChecklistRoutesPrams>>();

  const [checklist, setChecklist] = useState<Checklist>();

  useEffect(() => {
    if (focus) {
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
          });
      };
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
      .put("/api/checklists/" + route.params?.id + "/finish/")
      .then(() => navigation.goBack())
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text style={styles.title} numberOfLines={1}>
          {checklist?.property?.name}
        </Text>
      </View>
      <View style={styles.flatList}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 8,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <View style={{ display: "flex", gap: 8, marginBottom: 32 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text style={styles.cardSid}>{checklist?.sid}</Text>
              <Badge status={checklist?.status || ""} />
            </View>
            <Label title="ORGÃO" value={checklist?.organization.name} />
            <Label
              title="RESPONSÁVEL PELO IMÓVEL"
              value={checklist?.property.person?.name}
            />
            <Label title="IMÓVEL" value={checklist?.property.name} />
            <Label title="ENDEREÇO" value={checklist?.property.address} />
            <Label
              title="CRIADO EM"
              value={new Date(checklist?.created_at || "").toLocaleDateString()}
            />
          </View>
          <View style={{ gap: 8 }}>
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                backgroundColor: "#22c55e",
                borderRadius: 8,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() =>
                navigation.push("ChecklistItems", {
                  checklist,
                })
              }
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#1A1A1A",
                }}
              >
                ITENS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!!checklist?.finished_at}
              style={{
                paddingVertical: 12,
                backgroundColor: "#adadad",
                opacity: checklist?.finished_at ? 0.5 : 1,
                borderRadius: 8,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleFinishChecklist}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#1A1A1A",
                }}
              >
                FINALIZAR CHECKLIST
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "bold" },
  flatList: {
    flex: 1,
    padding: 16,
    backgroundColor: "#e8e8e8",
  },
  card: {
    padding: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "#c8ccda",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    color: "#1A1A1A",
  },
  cardSid: {
    color: "#3b3b3b",
    fontSize: 16,
  },
  cardImage: {
    height: 128,
    marginVertical: 8,
    borderRadius: 4,
  },
  iconsView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
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
