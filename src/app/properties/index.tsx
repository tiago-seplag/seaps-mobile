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

import { api } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

export function HomeScreen() {
  const [data, setData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const currentPageRef = useRef(1);

  const fetchData = async (pageToLoad = 1) => {
    if (loading || loadingMore) return;

    pageToLoad === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const response = await api.get(
        `/api/properties?page=${pageToLoad}&per_page=20`
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
      console.error("Erro ao buscar dados:", error);
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

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ marginVertical: 16 }} />;
  };

  const handleEditProperty = (property: any) => {
    navigation.push("EditProperty", {
      property,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title} numberOfLines={1}>
          Imóveis
        </Text>
        <TouchableOpacity onPress={() => navigation.push("CreateProperty")}>
          <Materialnicons name="add-home" size={32} color={"#1A1A1A"} />
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
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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
              key={item.item.id}
              style={styles.card}
              onPress={() => handleEditProperty(item.item)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.cardSid}>
                  {item.item.organization?.name}
                </Text>
                <Badge type={item.item.type} />
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.item.name}
              </Text>
              <Text style={styles.cardText} numberOfLines={1}>
                {item.item.address}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const Badge = ({ type }: { type: string }) => {
  return (
    <View
      style={{
        padding: 4,
        backgroundColor:
          type === "RENTED"
            ? "#ca8a04"
            : type === "GRANT"
            ? "#dc2626"
            : "#1a3280",
        borderRadius: 4,
      }}
    >
      <Text style={{ color: "white" }}>
        {type === "RENTED"
          ? "ALUGADO"
          : type === "GRANT"
          ? "CONCESSÃO"
          : "PRÓPRIO"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#c8ccda",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 8,
    gap: 4,
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
