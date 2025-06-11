import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaViewBase,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  StaticScreenProps,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";

import { ChecklistRoutesProps } from "./routes";

import { Header } from "../../components/ui/header";
import { ScoreBadge } from "../../components/score-badge";
import { Card, CardTitle } from "../../components/ui/card";

import { Toast } from "toastify-react-native";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

import { api } from "../../services/api";

type Props = StaticScreenProps<{
  checklist: Checklist;
}>;

export function ChecklistItemsScreen({ route }: Props) {
  const focus = useIsFocused();
  const navigation = useNavigation<ChecklistRoutesProps>();

  const [checklist, setChecklist] = useState<Checklist>(route.params.checklist);
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (focus) {
      const getData = () => {
        setLoading(true);
        api
          .get("/api/checklists/" + checklist.id)
          .then(({ data }) => {
            setChecklist(data);
          })
          .catch((e) => {
            if (e.response?.data?.message) {
              Toast.error(e.response.data.message);
            }
          })
          .finally(() => setLoading(false));
      };
      getData();
    }
  }, [refresh, focus]);

  return (
    <SafeAreaViewBase>
      <Header
        backButton
        title={checklist.property.name}
        style={{
          borderBottomColor:
            checklist?.status === "OPEN" ? "#067C03" : "#FD0006",
        }}
      />
      <FlatList
        data={checklist?.checklistItems}
        style={styles.flatList}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => setRefresh(!refresh)}
          />
        }
        renderItem={(item) => (
          <TouchableOpacity
            key={item.item.id}
            onPress={() =>
              navigation.push("ChecklistItem", {
                checklist,
                checklistItem: item.item,
              })
            }
          >
            <Card key={item.item.id}>
              <CardTitle>{item.item.item.name}</CardTitle>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {item.item.score !== null ? (
                  <ScoreBadge score={item.item.score} />
                ) : null}
                <Materialnicons
                  name="chevron-right"
                  size={32}
                  color={"#1A1A1A"}
                />
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </SafeAreaViewBase>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F1F2F4",
  },
});
