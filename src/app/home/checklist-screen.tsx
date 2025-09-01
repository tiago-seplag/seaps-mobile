import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";

import { api } from "../../services/api";
import { Header } from "../../components/ui/header";
import { ChecklistItem } from "../../components/checklist-item";
import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { useInfinityScroll } from "../../hooks/useInfinityScroll";
import { Row } from "../../components/row";
import { SearchInput } from "./components/search-input";
import debounce from "lodash.debounce";

type Props = StaticScreenProps<{
  refresh?: boolean | number;
}>;

function getChecklist(page: number = 1, params?: any) {
  return api.get<{ data: Checklist[]; meta: any }>(`/api/v1/checklists`, {
    params: {
      page,
      per_page: 20,
      ...params,
    },
  });
}

export function ChecklistsScreen({ route: { params } }: Props) {
  const navigation = useNavigation();

  const [search, setSearch] = useState("");
  const { data, loadingMore, loading, fetchData, loadMore } =
    useInfinityScroll(getChecklist);

  const debouncedFetchData = useCallback(
    debounce((value: string) => {
      fetchData(1, { property_name: value });
    }, 500),
    []
  );

  const handleSearchChange = (text: string) => {
    setSearch(text);
    debouncedFetchData(text);
  };

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
      <BaseView style={{ gap: 12 }}>
        <SearchInput
          value={search}
          placeholder="Procure pelo Imóvel"
          onChangeText={handleSearchChange}
        />
        <Row />
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() =>
                fetchData(1, search && { property_name: search })
              }
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: 92 }}
          renderItem={(item) => <ChecklistItem item={item} />}
        />
      </BaseView>
    </BaseSafeAreaView>
  );
}
