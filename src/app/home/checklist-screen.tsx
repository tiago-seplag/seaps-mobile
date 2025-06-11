import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import { api } from "../../services/api";
import {
  StaticScreenProps,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { Header } from "../../components/ui/header";
import { ChecklistItem } from "../../components/checklist-item";
import { BaseSafeAreaView } from "../../components/skeleton";

type Props = StaticScreenProps<{
  refresh?: boolean;
}>;

export function ChecklistsScreen({ route }: Props) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [data, setData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const currentPageRef = useRef(1);

  const fetchData = async (page = 1) => {
    if (loading || loadingMore) return;

    page === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const response = await api.get(
        `/api/checklists?page=${page}&per_page=20`
      );
      const responseData = response.data;

      if (page === 1) {
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
    if (isFocused || route.params.refresh) {
      fetchData(1);
    }
  }, [route.params.refresh, isFocused]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ marginVertical: 16 }} />;
  };

  return (
    <BaseSafeAreaView edges={["top"]}>
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
    </BaseSafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F1F2F4",
  },
});
