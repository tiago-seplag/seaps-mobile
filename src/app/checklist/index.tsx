import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../services/api";
import { RadioGroup } from "react-native-radio-buttons-group";
import Ionicons from "@expo/vector-icons/Ionicons";
import Materialnicons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChecklistRoutesPrams } from "./routes";

const radioButtons = [
  {
    id: "1",
    label: "Ruim",
    color: "#fca5a5",
    containerStyle: {
      padding: 10,
      borderColor: "#fca5a5",
      borderWidth: 1,
      borderRadius: 4,
      flex: 1,
    },
    value: "1",
  },
  {
    id: "2",
    color: "#fde047",
    label: "Regular",
    containerStyle: {
      padding: 10,
      borderColor: "#fde047",
      borderWidth: 1,
      borderRadius: 4,
      flex: 1,
      marginHorizontal: 0,
    },
    value: "2",
  },
  {
    id: "3",
    color: "#86efac",
    containerStyle: {
      padding: 10,
      borderColor: "#86efac",
      borderWidth: 1,
      borderRadius: 4,
      flex: 1,
    },
    label: "Bom",
    value: "3",
  },
];

interface Checklist {
  user_id: string | null;
  status: String;
  id: string;
  sid: string;
  model_id: string;
  property_id: string;
  created_by: string | null;
  person_id: string | null;
  finished_at: Date | null;
  created_at: Date;
  updated_at: Date;
  property: {
    type: string;
    id: string;
    person_id: string | null;
    created_at: Date;
    updated_at: Date;
    name: string;
    address: string | null;
    organization_id: string;
    location: string | null;
    person?: {
      id: string;
      created_at: Date;
      updated_at: Date;
      name: string;
      role: string | null;
      email: string | null;
      organization_id: string;
      phone: string | null;
    };
  };
  checklistItems: {
    id: string;
    created_at: Date;
    updated_at: Date;
    checklist_id: string;
    item_id: string;
    score: number | null;
    observation: string | null;
    image: string | null;
    is_inspected: boolean;
    item: {
      name: string;
    };
  }[];
}

export function ChecklistScreen({ route }: any) {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChecklistRoutesPrams>>();

  const [checklist, setChecklist] = useState<Checklist>();
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    const getData = () => {
      api
        .get("/api/checklists/" + route.params?.id)
        .then(({ data }) => {
          setChecklist(data);
        })
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    };
    getData();
  }, [refresh]);

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
        .catch((e) => console.log(e))
        .finally(() => setLock(false));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text style={{ fontSize: 26, fontWeight: "bold" }} numberOfLines={1}>
          {checklist?.property?.name}
        </Text>
      </View>
      <FlatList
        data={checklist?.checklistItems}
        style={{
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
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => setRefresh(!refresh)}
          />
        }
        renderItem={(item) => (
          <View key={item.item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.item.item?.name}</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  navigation.push("Photos", {
                    checklistItem: item.item,
                  })
                }
              >
                <Ionicons name="camera" size={32} color={"#1A1A1A"} />
                <Text
                  style={{
                    color: "#1A1A1A",
                  }}
                >
                  Imagens
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Materialnicons name="sms" size={32} color={"#1A1A1A"} />
                <Text
                  style={{
                    color: "#1A1A1A",
                  }}
                >
                  Observação
                </Text>
              </TouchableOpacity>
            </View>
            <RadioGroup
              radioButtons={radioButtons}
              containerStyle={{
                justifyContent: "space-between",
                padding: 0,
                paddingHorizontal: 0,
                marginHorizontal: 0,
              }}
              onPress={(value) => handlePressRadio(value, item.item.id)}
              layout="row"
              selectedId={String(item.item.score)}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#c8ccda",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardImage: {
    height: 128,
    marginVertical: 8,
    borderRadius: 4,
  },
  observation: {
    marginBottom: 8,
    fontSize: 16,
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
