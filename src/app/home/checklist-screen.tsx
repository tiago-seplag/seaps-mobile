import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

import { api } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components/ui/header";
import { ChecklistBadge } from "../../components/checklist-badge";
import { Card, CardText, CardTitle } from "../../components/ui/card";
import { ChecklistItem } from "../../components/checklist-item";

export function ChecklistsScreen({ route }: any) {
  const navigation = useNavigation<any>();

  const [data, setData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const currentPageRef = useRef(1);

  const fetchData = async (pageToLoad = 1) => {
    if (loading || loadingMore) return;

    pageToLoad === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const response = await api.get(
        `/api/checklists?page=${pageToLoad}&per_page=20`
      );
      const responseData = response.data;

      if (pageToLoad === 1) {
        setData(responseData.data);
      } else {
        setData((prev) => [...prev, ...responseData.data]);
      }

      currentPageRef.current = responseData.meta.current_page;
      setLastPage(responseData.meta.last_page);
    } catch (error) {
      console.log("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && currentPageRef.current < lastPage) {
      fetchData(currentPageRef.current + 1);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    if (route?.params?.refresh) {
      fetchData(1);
    }
  }, [route?.params?.refresh]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ marginVertical: 16 }} />;
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#1A3180" }}
      edges={["top"]}
    >
      <Header
        title="Checklists"
        icon={"domain"}
        actionProps={{
          action: () =>
            navigation.navigate("CreateChecklist", {
              screen: "CreateChecklistScreen",
            }),
          icon: "add-chart",
        }}
      />
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "#F1F2F4",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => fetchData(1)}
            />
          }
          style={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: 92 }}
          renderItem={(item) => <ChecklistItem item={item} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F1F2F4",
  },
  cardSid: {
    fontFamily: "mono",
    fontSize: 12,
  },
});
