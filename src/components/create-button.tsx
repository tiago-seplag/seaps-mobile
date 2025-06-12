import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Card, CardTitle } from "./ui/card";
import { Icon } from "./icon";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const CreateButton = ({
  icon,
  title,
  style,
  ...props
}: {
  title: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
} & TouchableOpacityProps) => {
  return (
    <TouchableOpacity {...props}>
      <Card
        style={{
          alignItems: "center",
          backgroundColor: "#E8EAF2",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Icon
          style={{
            backgroundColor: "#E8EAF2",
            paddingHorizontal: 4,
          }}
          icon={icon || "add"}
        />
        <CardTitle style={{ fontSize: 16 }}>{title}</CardTitle>
      </Card>
    </TouchableOpacity>
  );
};
