import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import Materialnicons from "@expo/vector-icons/MaterialIcons";

export const Button = ({
  title,
  text,
  style,
  color,
  icon,
  loading,
  ...props
}: TouchableOpacityProps & {
  title: string;
  text?: string;
  color?: string;
  loading?: boolean;
  icon: any;
}) => {
  let COLOR = color || "#0B1536";

  const DISABLED = props.disabled || loading;

  return (
    <TouchableOpacity
      {...props}
      disabled={DISABLED}
      style={[{ ...styles.card, opacity: DISABLED ? 0.3 : 1 }, style]}
    >
      <View
        style={{ backgroundColor: "#FFFFFF", padding: 14, borderRadius: 12 }}
      >
        <Materialnicons name={icon} size={24} color={"#0B1536"} />
      </View>
      <View>
        <Text style={[styles.title]}>{title}</Text>
        {text && <Text style={[styles.text]}>{text}</Text>}
      </View>
      {loading && <ActivityIndicator style={{ marginLeft: "auto" }} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#0B1536",
  },
  text: {
    color: "#0B153680",
  },
  card: {
    gap: 6,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    lineHeight: 22,
  },
  cardText: {
    fontSize: 12,
  },
});
