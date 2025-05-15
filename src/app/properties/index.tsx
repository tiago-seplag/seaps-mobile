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
import { Toast } from "toastify-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

export function HomeScreen() {
  const focus = useIsFocused();
  const [data, setData] = useState<any>([]);

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFirstPageReceived, setIsFirstPageReceived] = useState(false);

  const nextPageIdentifierRef = useRef<any>();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // const fetchData = () => {
  //   setLoading(true);
  //   getDataFromApi(nextPageIdentifierRef.current).then((response) => {
  //     const { data: newData, next_page } = parseResponse(response);
  //     setData([...data, newData]);
  //     nextPageIdentifierRef.current = next_page;
  //     setLoading(false);
  //     !isFirstPageReceived && setIsFirstPageReceived(true);
  //   });
  // };

  // const fetchNextPage = () => {
  //   if (nextPageIdentifierRef.current == null) {
  //     // End of data.
  //     return;
  //   }
  //   fetchData();
  // };

  // const parseResponse = (response: any) => {
  //   let data = response.data;
  //   let next_page = response.next_page;
  //   // parse response and return list and nextPage identifier.
  //   return {
  //     data,
  //     next_page,
  //   };
  // };

  // const getDataFromApi = (page: number) => {
  //   return api.get(`/api/properties?page=${page}&per_page=100`);
  // };

  // const ListEndLoader = () => {
  //   if (!isFirstPageReceived && loading) {
  //     // Show loader at the end of list when fetching next page data.
  //     return <ActivityIndicator size={"large"} />;
  //   }
  // };

  useEffect(() => {
    const getData = () => {
      api
        .get("/api/properties?page=1&per_page=100")
        .then(({ data }) => setData(data.data))
        .catch((e) => {
          if (e.response?.data?.message) {
            Toast.error(e.response.data.message);
          }
        })
        .finally(() => setLoading(false));
    };
    if (focus) getData();
  }, [refresh, focus]);

  if (!isFirstPageReceived && loading) {
    // Show loader when fetching first page data.
    return <ActivityIndicator size={"small"} />;
  }

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
          <View key={item.item.id} style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.cardSid}>{item.item.organization.name}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.item.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

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
