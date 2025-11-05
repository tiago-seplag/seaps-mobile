import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const Header = ({
  backButton,
  actionProps,
  title,
  style,
}: {
  title?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  actionProps?: {
    icon: keyof typeof MaterialIcons.glyphMap;
    action: () => void;
    disabled?: boolean;
  };
  style?: StyleProp<ViewStyle>;
  backButton?: boolean;
}) => {
  const navigation = useNavigation();

  return (
    <View
      style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 4,
          gap: 4,
          alignItems: "center",
          flexDirection: "row",
          borderBottomColor: "#6675AA",
          backgroundColor: "#1a3280",
          borderBottomWidth: 3,
        },
        style,
      ]}
    >
      {backButton && (
        <TouchableOpacity
          style={{
            paddingHorizontal: 4,
          }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={32} color={"#E8E8E8"} />
        </TouchableOpacity>
      )}
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {actionProps && (
          <TouchableOpacity
            style={{ opacity: actionProps.disabled ? 0.5 : 1 }}
            disabled={actionProps.disabled}
            onPress={actionProps.action}
          >
            <MaterialIcons
              name={actionProps.icon}
              size={32}
              color={"#E8E8E8"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: "#E8E8E8",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
