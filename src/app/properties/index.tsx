import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { api } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

import { PropertyItem } from "../../components/property-item";
import { BaseSafeAreaView } from "../../components/skeleton";

export function PropertiesScreen() {
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
    <BaseSafeAreaView
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
        <Text numberOfLines={1}>Imóveis</Text>
        <TouchableOpacity onPress={() => navigation.push("CreateProperty")}>
          <Materialnicons name="add-home" size={32} color={"#E8E8E8"} />
        </TouchableOpacity>
      </View>
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
            backgroundColor: "#e8e8e8",
            shadowColor: "black",
            shadowOffset: {
              height: 2,
              width: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
          renderItem={(item) => <PropertyItem item={item} />}
        />
      )}
    </BaseSafeAreaView>
  );
}
