import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Card, CardHeader, CardText, CardTitle } from "./ui/card";
import { Icon } from "./icon";
import { PropertyBadge } from "./property-badge";

export const PropertyItem = ({ item }: any) => {
  const navigation = useNavigation();

  const handleEditProperty = (property: any) => {
    return navigation.navigate("PropertyRoutes", {
      screen: "EditProperty",
      params: { property },
    });
  };

  return (
    <TouchableOpacity
      key={item.item.id}
      onPress={() => handleEditProperty(item.item)}
    >
      <Card>
        <CardHeader>
          <CardText numberOfLines={1} style={{ fontWeight: 300 }}>
            {item.item.organization?.name}
          </CardText>
          <PropertyBadge type={item.item.type} />
        </CardHeader>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 4,
          }}
        >
          <CardTitle numberOfLines={2}>{item.item.name}</CardTitle>
          <Icon icon="edit" style={{ backgroundColor: "#E8EAF2" }} />
        </View>
        <CardText numberOfLines={1}>{item.item.address}</CardText>
      </Card>
    </TouchableOpacity>
  );
};
