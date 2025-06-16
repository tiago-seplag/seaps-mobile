import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";

import { api } from "../../services/api";
import { Header } from "../../components/ui/header";
import { ChecklistItem } from "../../components/checklist-item";
import { BaseSafeAreaView } from "../../components/skeleton";
import { useInfinityScroll } from "../../hooks/useInfinityScroll";

type Props = StaticScreenProps<{
  refresh?: boolean;
}>;

function getChecklist(page: number = 1, params?: any) {
  return api.get<{ data: Checklist[]; meta: any }>(`/api/checklists`, {
    params: {
      page,
      per_page: 20,
      ...params,
    },
  });
}

export function ChecklistsScreen({ route: { params } }: Props) {
  const navigation = useNavigation();

  const { data, loadingMore, loading, fetchData, loadMore } =
    useInfinityScroll(getChecklist);

  useEffect(() => {
    fetchData(1);
  }, [params?.refresh]);

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
              screen: "StepOne",
            }),
          icon: "add-chart",
        }}
      />
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => fetchData(1)} />
        }
        style={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 92 }}
        renderItem={(item) => <ChecklistItem item={item} />}
      />
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
