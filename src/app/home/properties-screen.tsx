import { useEffect } from "react";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";

import { StaticScreenProps, useNavigation } from "@react-navigation/native";

import { api } from "../../services/api";
import { Header } from "../../components/ui/header";
import { PropertyItem } from "../../components/property-item";
import { BaseSafeAreaView } from "../../components/skeleton";
import { useInfinityScroll } from "../../hooks/useInfinityScroll";

type Props = StaticScreenProps<{
  refresh?: boolean | number;
}>;

function getProperties(page: number = 1, params?: any) {
  return api.get<{ data: Property[]; meta: any }>(`/api/properties`, {
    params: {
      page,
      per_page: 20,
      ...params,
    },
  });
}

export function PropertiesScreen({ route: { params } }: Props) {
  const navigation = useNavigation();

  const { data, loadingMore, loading, fetchData, loadMore } =
    useInfinityScroll(getProperties);

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
        title="IMÓVEIS"
        icon={"domain"}
        actionProps={{
          action: () =>
            navigation.navigate("CreateProperty", {
              screen: "StepOne",
              params: {
                origin: "HomeScreen",
              },
            }),
          icon: "add-home",
        }}
      />
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => fetchData(1)} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 92 }}
        ListFooterComponent={renderFooter}
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: "#F1F2F4",
        }}
        renderItem={(item) => <PropertyItem item={item} />}
      />
    </BaseSafeAreaView>
  );
}
