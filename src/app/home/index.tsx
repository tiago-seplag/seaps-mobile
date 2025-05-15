import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../..";
import { SafeAreaView } from "react-native-safe-area-context";

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const screen = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Checklists", {
            screen: "ChecklistsScreen",
          });
        }}
        style={styles.card}
      >
        <Materialnicons name="list" size={36} color={"#1A1A1A"} />
        <Text style={{ fontSize: 16 }}>Checklists</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() => {
          navigation.navigate("Properties", {
            screen: "PropertiesScreen",
          });
        }}
        style={styles.card}
      >
        <Materialnicons name="apartment" size={36} color={"#1A1A1A"} />
        <Text style={{ fontSize: 16 }}>Imóveis</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => {
          screen.push("Account");
        }}
        style={styles.card}
      >
        <Materialnicons name="person" size={36} color={"#1A1A1A"} />
        <Text style={{ fontSize: 16 }}>Conta</Text>
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
