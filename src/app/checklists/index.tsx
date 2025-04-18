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

import { api } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../..";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

export function HomeScreen() {
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const getData = () => {
      api
        .get("/api/checklists?page=1&per_page=100")
        .then(({ data }) => setData(data.data))
        .catch((e) => {
          if (e.response?.data?.message) {
            Toast.error(e.response.data.message);
          }
        })
        .finally(() => setLoading(false));
    };
    getData();
  }, [refresh]);

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => setRefresh(!refresh)}
          />
        }
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
        renderItem={(item) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Checklist", {
                screen: "ChecklistScreen",
                params: { id: item.item.id },
              });
            }}
            key={item.item.id}
            style={styles.card}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.cardSid}>{item.item.sid}</Text>
              <Badge status={item.item.status} />
            </View>
            <Text style={styles.cardTitle}>{item.item.property.name}</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 16,
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.cardText}>{item.item.organization.name}</Text>
              <Text style={styles.cardText}>
                {item.item.property.person?.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const Badge = ({ status }: { status: string }) => {
  return (
    <View
      style={{
        padding: 4,
        backgroundColor: status === "OPEN" ? "green" : "red",
        borderRadius: 4,
      }}
    >
      <Text style={{ color: "white" }}>
        {status === "OPEN" ? "ABERTO" : "FECHADO"}
      </Text>
    </View>
  );
};

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
    gap: 8,
  },
  cardTitle: {
    fontSize: 22,
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
  observation: {
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
