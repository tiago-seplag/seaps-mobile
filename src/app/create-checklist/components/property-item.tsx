import { TouchableOpacity, View } from "react-native";
import { Card, CardText, CardTitle } from "../../../components/ui/card";
import { PropertyBadge } from "../../../components/property-badge";
import { Icon } from "../../../components/icon";

export const PropertyItem = ({
  item,
  selected,
  onSelect,
}: {
  item: any;
  selected: boolean;
  onSelect: () => void;
}) => {
  return (
    <TouchableOpacity key={item.item.id} onPress={onSelect}>
      <Card
        style={[
          {
            backgroundColor: selected ? "#E8EAF2" : "#FFFFFF",
            borderColor: "#182D74",
            borderWidth: 1,
            gap: 4,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CardText numberOfLines={1} style={{ fontSize: 12 }}>
            {item.item.organization?.name}
          </CardText>
          <PropertyBadge type={item.item?.type} />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
            minHeight: 22 * 2,
            gap: 4,
          }}
        >
          <CardTitle style={{ fontSize: 22, flex: 1 }} numberOfLines={2}>
            {item.item.name}
          </CardTitle>
          <Icon
            icon={selected ? "radio-button-checked" : "radio-button-unchecked"}
            style={{ backgroundColor: "#E8EAF2" }}
          />
        </View>
        <CardText numberOfLines={1} style={{ fontSize: 14 }}>
          {item.item?.address}
        </CardText>
      </Card>
    </TouchableOpacity>
  );
};
