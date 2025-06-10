import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../..";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../contexts/authContext";
import { getFirstAndLastName } from "../../utils";
import { Button } from "../../components/ui/button";
import { ChecklistItem } from "../../components/checklist-item";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export function HomeScreen() {
  const { user } = useSession();

  const [data, setData] = useState();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const screen = useNavigation<NativeStackNavigationProp<any>>();

  const fetchData = async () => {
    const response = await api.get(
      `/api/checklists?page=1&per_page=5&user_id=${user.id}`
    );
    setData(response.data.data);
  };

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user?.id]);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: "#1a3280",
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomColor: "#6675AA",
          backgroundColor: "#1a3280",
          borderBottomWidth: 3,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <View
            style={{
              backgroundColor: "#F1F2F4",
              padding: 12,
              borderRadius: "100%",
              alignItems: "center",
            }}
          >
            <Materialnicons name="person" size={32} color={"#1A3180"} />
          </View>
          <View style={{ gap: 2 }}>
            <Text style={styles.name} numberOfLines={1}>
              {getFirstAndLastName(user?.name)}
            </Text>
            <Text style={styles.role} numberOfLines={1}>
              {user?.role}
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: 12,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AccountRoutes", {
                screen: "AccountScreen",
              })
            }
          >
            <Materialnicons name="settings" size={24} color={"#E8E8E8"} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          backgroundColor: "#F1F2F4",
          padding: 16,
        }}
      >
        <View style={{ gap: 12 }}>
          <Text style={{ color: "#1A3180", fontSize: 16, fontWeight: 400 }}>
            AÇÕES RÁPIDAS:
          </Text>
          <Button
            icon="add-task"
            title="CRIAR CHECKLIST"
            text="Criar um novo checklist"
            onPress={() =>
              navigation.navigate("CreateChecklist", {
                screen: "CreateChecklistScreen",
              })
            }
          />
          <Button
            icon="domain-add"
            title="CRIAR IMÓVEL"
            text="Criar um novo imóvel"
            onPress={() =>
              navigation.navigate("Properties", {
                screen: "CreateProperty",
              })
            }
          />
        </View>
        <View
          style={{
            height: 4,
            borderRadius: 4,
            backgroundColor: "#B8BFD8",
            width: "100%",
            marginVertical: 16,
          }}
        />
        <View style={{ gap: 12, flex: 1 }}>
          <Text style={{ color: "#1A3180", fontSize: 16, fontWeight: 400 }}>
            CHECKLIST RECENTES:
          </Text>
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={fetchData} />
            }
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 96 }}
            renderItem={(item) => <ChecklistItem item={item} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E8E8E8",
  },
  role: { color: "#E8E8E8", fontSize: 14 },
});
