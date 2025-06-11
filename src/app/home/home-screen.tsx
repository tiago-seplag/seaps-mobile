import { FlatList, RefreshControl, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../contexts/authContext";
import { Button } from "../../components/ui/button";
import { ChecklistItem } from "../../components/checklist-item";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { HomeHeader } from "./components/home-header";
import { Row } from "../../components/row";

export function HomeScreen() {
  const { user } = useSession();

  const [data, setData] = useState();

  const navigation = useNavigation<any>();

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
      <HomeHeader />
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
        <Row style={{ marginVertical: 16 }} />
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
