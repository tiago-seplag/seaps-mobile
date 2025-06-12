import { TouchableOpacity, View } from "react-native";
import { Card, CardText, CardTitle } from "../../../components/ui/card";
import { Icon } from "../../../components/icon";

export const PersonItem = ({
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
            backgroundColor: selected === item.item.id ? "#E8EAF2" : "#FFFFFF",
          },
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <View>
          <CardTitle numberOfLines={1} style={{ fontSize: 16 }}>
            {item.item.name}
          </CardTitle>
          <CardText numberOfLines={1} style={{ fontSize: 14 }}>
            {item.item.role}
          </CardText>
          <CardText numberOfLines={1} style={{ fontWeight: 300 }}>
            {item.item.email}
          </CardText>
        </View>
        <Icon
          icon={selected ? "radio-button-checked" : "radio-button-unchecked"}
          style={{ backgroundColor: "#E8EAF2" }}
        />
      </Card>
    </TouchableOpacity>
  );
};
