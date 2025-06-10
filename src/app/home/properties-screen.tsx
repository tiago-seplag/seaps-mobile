import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";

import { api } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Materialnicons from "@expo/vector-icons/MaterialIcons";
import { Card, CardText, CardTitle } from "../../components/ui/card";
import { Header } from "../../components/ui/header";
import { PropertyBadge } from "../../components/property-badge";

export function PropertiesScreen() {
  const [data, setData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigation = useNavigation();

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
    return navigation.navigate("Properties", {
      screen: "EditProperty",
      params: { property },
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#1A3180" }}
      edges={["top"]}
    >
      <Header
        title="IMÓVEIS"
        icon={"domain"}
        actionProps={{
          action: () =>
            navigation.navigate("Properties", {
              screen: "CreateProperty",
            }),
          icon: "add-home",
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
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: 92 }}
          ListFooterComponent={renderFooter}
          style={{
            flex: 1,
            padding: 16,
            backgroundColor: "#F1F2F4",
            shadowColor: "black",
            shadowOffset: {
              height: 2,
              width: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
          renderItem={(item) => (
            <Card
              key={item.item.id}
              onPress={() => handleEditProperty(item.item)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CardText numberOfLines={1} style={{ fontWeight: 300 }}>
                  {item.item.organization?.name}
                </CardText>
                <PropertyBadge type={item.item.type} />
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <CardTitle numberOfLines={2}>{item.item.name}</CardTitle>
                <View
                  style={{
                    backgroundColor: "#E8EAF2",
                    padding: 16,
                    borderRadius: 12,
                  }}
                >
                  <Materialnicons name="edit" size={24} color={"#1A3180"} />
                </View>
              </View>
              <CardText numberOfLines={1}>{item.item.address}</CardText>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
