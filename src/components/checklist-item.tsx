import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Card, CardHeader, CardText, CardTitle } from "./ui/card";
import { ChecklistBadge } from "./checklist-badge";
import { Icon } from "./icon";

export const ChecklistItem = ({ item }: any) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Checklist", {
          screen: "Checklist",
          params: { id: item.item.id },
        });
      }}
      key={item.item.id}
    >
      <Card style={{ gap: 8 }}>
        <CardHeader>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <CardText style={{ fontFamily: "mono", fontSize: 12 }}>
              {item.item.sid}
            </CardText>
            <CardText>-</CardText>
            <CardText>{item.item.organization.name}</CardText>
          </View>
          <ChecklistBadge status={item.item.status} />
        </CardHeader>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <CardTitle numberOfLines={2}>{item.item.property.name}</CardTitle>
          <Icon icon="chevron-right" style={{ backgroundColor: "#E8EAF2" }} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
