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
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Materialnicons from "@expo/vector-icons/MaterialIcons";
import { getFirstAndLastName } from "../../utils";

export function HomeScreen() {
  const focus = useIsFocused();
  const [data, setData] = useState<any>([]);

  const [loading, setLoading] = useState(true);
  const [isFirstPageReceived, setIsFirstPageReceived] = useState(false);

  const nextPageIdentifierRef = useRef<any>();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchData = () => {
    setLoading(true);
    getDataFromApi(nextPageIdentifierRef.current).then(({ data }) => {
      setData((prev: any) => [...prev, ...data.data]);
      nextPageIdentifierRef.current = data.meta.next_page.split("=")[1];
      setLoading(false);
      !isFirstPageReceived && setIsFirstPageReceived(true);
    });
  };

  const fetchNextPage = () => {
    if (nextPageIdentifierRef.current == null) {
      return;
    }
    fetchData();
  };

  const getDataFromApi = (page: number | null = 1) => {
    return api.get(
      `/api/properties?page=${page === null ? 1 : page}&per_page=20`
    );
  };

  const refreshData = () => {
    getDataFromApi().then(({ data }) => {
      setData(data.data);
      nextPageIdentifierRef.current = data.meta.next_page.split("=")[1];
      setLoading(false);
    });
  };

  useEffect(() => {
    if (focus) refreshData();
  }, [focus]);

  const ListEndLoader = () => {
    if (!isFirstPageReceived && loading) {
      // Show loader at the end of list when fetching next page data.
      return <ActivityIndicator size={"large"} />;
    }
  };

  if (!isFirstPageReceived && loading) {
    return <ActivityIndicator size={"small"} />;
  }

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
          Propriedades
        </Text>
        <TouchableOpacity onPress={() => navigation.push("CreateProperty")}>
          <Materialnicons name="add-home" size={32} color={"#1A1A1A"} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListEndLoader}
        onEndReached={fetchNextPage}
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
              <Text style={styles.cardSid}>{item.item.organization?.name}</Text>
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
