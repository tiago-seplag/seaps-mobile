import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const FormButton = ({
  icon,
  title,
  style,
  ...props
}: {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
} & TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      style={[
        {
          marginTop: "auto",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#067C03",
          padding: 12,
          borderRadius: 12,
          gap: 4,
        },
        style,
      ]}
      {...props}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#FEFEFE",
        }}
      >
        {title}
      </Text>
      <MaterialIcons name={icon} size={32} color={"#FEFEFE"} />
    </TouchableOpacity>
  );
};
