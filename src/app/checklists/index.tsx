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

export function HomeScreen({ route }: any) {
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
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title} numberOfLines={1}>
          Checklists
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CreateChecklist", {
              screen: "CreateChecklistScreen",
            })
          }
        >
          <Materialnicons name="add-chart" size={32} color={"#E8E8E8"} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text style={styles.cardSid}>{item.item.sid}</Text>
                  <Text style={styles.cardText}>-</Text>
                  <Text style={styles.cardText}>
                    {item.item.organization.name}
                  </Text>
                </View>
                <Badge status={item.item.status} />
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.item.property.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const Badge = ({ status }: { status: string }) => {
  return (
    <View
      style={{
        padding: 4,
        backgroundColor: status === "OPEN" ? "#067C0320" : "#FD000620",
        borderColor: status === "OPEN" ? "#067C03" : "#FD0006",
        width: 72,
        borderWidth: 1,
        borderRadius: 6,
      }}
    >
      <Text
        style={{
          color: status === "OPEN" ? "#067C03" : "#FD0006",
          fontWeight: "bold",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        {status === "OPEN" ? "ABERTO" : "FECHADO"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F1F2F4",
  },
  title: {
    fontSize: 26,
    color: "#E8E8E8",
    fontWeight: "bold",
  },
  card: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#c8ccda",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 8,
    gap: 4,
  },
  cardTitle: {
    fontSize: 22,
    color: "#0E1B46",
    fontWeight: "bold",
  },
  cardText: {
    color: "#485A99",
    fontFamily: "Inter300",
  },
  cardSid: {
    fontFamily: "mono",
    color: "#485A99",
    fontSize: 14,
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
