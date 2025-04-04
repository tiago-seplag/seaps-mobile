import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../contexts/authContext";

export function AccountScreen() {
  const { signOut } = useSession();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
      }}
    >
      <TouchableOpacity onPress={signOut} style={styles.card}>
        <Materialnicons name="logout" size={36} color={"#1A1A1A"} />
        <Text>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#c8ccda",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 8,
    gap: 8,
    justifyContent: "center",
    width: 100,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  cardText: {
    color: "#1A1A1A",
  },
  cardSid: {
    color: "#3b3b3b",
    fontSize: 16,
  },
  cardImage: {
    height: 128,
    marginVertical: 8,
    borderRadius: 4,
  },
  observation: {
    fontSize: 16,
  },
  iconButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderWidth: 1,
    borderColor: "#1A1A1A",
    borderRadius: 3,
    flex: 1,
  },
});
