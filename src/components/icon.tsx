import { StyleSheet, View, ViewProps } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const Icon = ({
  icon,
  size = 24,
  color = "#1A3180",
  style,
  ...props
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
} & ViewProps) => {
  return (
    <View style={[styles.icon, style]} {...props}>
      <MaterialIcons name={icon} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
});
