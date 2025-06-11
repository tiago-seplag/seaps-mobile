import { View } from "react-native";
import { Card, CardText, CardTitle } from "./ui/card";
import { ChecklistBadge } from "./checklist-badge";
import { useNavigation } from "@react-navigation/native";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

export const ChecklistItem = ({ item }: any) => {
  const navigation = useNavigation<any>();

  return (
    <Card
      onPress={() => {
        navigation.navigate("Checklist", {
          screen: "ChecklistScreen",
          params: { id: item.item.id },
        });
      }}
      style={{ gap: 8 }}
      key={item.item.id}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <CardText style={{ fontFamily: "mono", fontSize: 12 }}>
            {item.item.sid}
          </CardText>
          <CardText>-</CardText>
          <CardText>{item.item.organization.name}</CardText>
        </View>
        <ChecklistBadge status={item.item.status} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <CardTitle numberOfLines={2}>{item.item.property.name}</CardTitle>
        <View
          style={{
            backgroundColor: "#E8EAF2",
            padding: 10,
            borderRadius: 12,
          }}
        >
          <Materialnicons name="chevron-right" size={24} color={"#1A3180"} />
        </View>
      </View>
    </Card>
  );
};
