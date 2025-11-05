import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { getFirstAndLastName } from "../../../utils";
import { useSession } from "../../../contexts/authContext";
import { Icon } from "../../../components/icon";

export function HomeHeader() {
  const { user } = useSession();

  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <Icon icon={"person"} size={32} style={{ borderRadius: "100%" }} />
        <View style={{ gap: 2 }}>
          <Text style={styles.name} numberOfLines={1}>
            {getFirstAndLastName(user?.name)}
          </Text>
          <Text style={styles.role} numberOfLines={1}>
            {user?.role}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("AccountRoutes", {
            screen: "Account",
          })
        }
        style={{
          justifyContent: "center",
        }}
      >
        <MaterialIcons name="settings" size={24} color={"#E8E8E8"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#6675AA",
    backgroundColor: "#1a3280",
    borderBottomWidth: 3,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E8E8E8",
  },
  role: { color: "#E8E8E8", fontSize: 14 },
});
