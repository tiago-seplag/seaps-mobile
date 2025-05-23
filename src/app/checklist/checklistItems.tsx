import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../services/api";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChecklistRoutesPrams } from "./routes";

import Materialnicons from "@expo/vector-icons/MaterialIcons";
import RadioGroup from "../../components/RadioGroup";
import { Toast } from "toastify-react-native";

export function ChecklistItemsScreen({ route }: any) {
  const focus = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<ChecklistRoutesPrams>>();

  const [checklist, setChecklist] = useState<Checklist>(route.params.checklist);
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    if (focus && !loading) {
      const getData = () => {
        api
          .get("/api/checklists/" + checklist.id)
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
      getData();
    }
  }, [refresh, focus, loading]);

  const handlePressRadio = async (value: string, id: string) => {
    if (!lock) {
      setLock(true);
      await api
        .put("/api/checklist-item/" + id, { score: value })
        .then(() =>
          setChecklist((oldValue: any) => ({
            ...oldValue,
            checklistItems: oldValue.checklistItems.map((item: any) =>
              item.id === id ? { ...item, score: value } : item
            ),
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

  const handleNavigateToImages = (item: ChecklistItem) => {
    navigation.push("Photos", {
      checklist,
      checklistItem: item,
    });
  };

  const handleNavigateToObservation = (item: ChecklistItem) => {
    navigation.push("Observation", {
      checklist,
      checklistItem: item,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text style={styles.title} numberOfLines={1}>
          {checklist?.property?.name}
        </Text>
      </View>
      <FlatList
        data={checklist?.checklistItems}
        style={styles.flatList}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setLoading(true);
              setRefresh(!refresh);
            }}
          />
        }
        renderItem={(item) => (
          <View key={item.item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.item.item.name}</Text>
            <View style={styles.iconsView}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleNavigateToImages(item.item)}
              >
                <Materialnicons name="camera-alt" size={32} color={"#1A1A1A"} />
                <Text style={{ color: "#1A1A1A" }}>Imagens</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleNavigateToObservation(item.item)}
              >
                <Materialnicons name="sms" size={32} color={"#1A1A1A"} />
                <Text style={{ color: "#1A1A1A" }}>Observação</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <RadioGroup
                radioButtons={radioButtons}
                containerStyle={{ gap: 8 }}
                disabled={checklist?.status === "CLOSED"}
                onPress={(value) => handlePressRadio(value, item.item.id)}
                selectedId={String(item.item.score)}
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "bold" },
  flatList: {
    flex: 1,
    padding: 16,
    backgroundColor: "#e8e8e8",
    shadowColor: "black",
    shadowOffset: {
      height: 2,
      width: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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

const radioButtonStyles = {
  padding: 10,
  borderWidth: 1,
  borderRadius: 4,
  marginHorizontal: 0,
  margin: 0,
};

const radioButtons = [
  {
    id: "-2",
    label: "Ruim",
    value: "-2",
    color: "#ef4444",
    backgroundColor: "#fecaca",
    containerStyle: {
      borderColor: "#ef4444",
      ...radioButtonStyles,
      flex: 1,
    },
  },
  {
    id: "1",
    color: "#eab308",
    backgroundColor: "#fef08a",
    label: "Regular",
    value: "1",
    containerStyle: {
      borderColor: "#eab308",
      ...radioButtonStyles,
      flex: 1,
    },
  },
  {
    id: "3",
    color: "#22c55e",
    backgroundColor: "#bbf7d0",
    label: "Bom",
    value: "3",
    containerStyle: {
      borderColor: "#22c55e",
      ...radioButtonStyles,
      flex: 1,
    },
  },
  {
    id: "0",
    color: "#71717a",
    backgroundColor: "#e4e4e7",
    label: "Não se Aplica",
    value: "0",
    containerStyle: {
      borderColor: "#71717a",
      ...radioButtonStyles,
      marginVertical: 0,
      width: `100%` as any,
    },
  },
];
