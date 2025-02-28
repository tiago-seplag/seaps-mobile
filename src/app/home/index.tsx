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
import { RootStackParamList } from "../../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export function HomeScreen() {
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const getData = () => {
      api
        .get("/api/checklists")
        .then(({ data }) => setData(data))
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    };
    getData();
  }, [refresh]);

  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={({ highlighted }) => (
        <View style={[styles.separator, highlighted && { marginLeft: 0 }]} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => setRefresh(!refresh)}
        />
      }
      renderItem={(item) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Checklists", {
              screen: "Checklist",
              params: { id: item.item.id },
            });
          }}
          key={item.item.id}
          style={{ flex: 1, padding: 10 }}
        >
          <Text>{item.item.sid}</Text>
          <Text>{item.item.property.name}</Text>
          <Text>{item.item.property.organization.name}</Text>
          <Text>{item.item.user.name}</Text>
          <Text>{item.item.status}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    margin: 1,
    backgroundColor: "blue",
    height: 2,
  },
  title: {
    fontSize: 32,
  },
});
