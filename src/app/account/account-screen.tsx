import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../contexts/authContext";
import { useState } from "react";
import { Label } from "../../components/Label";
import { Toast } from "toastify-react-native";

export function AccountScreen() {
  const { signOut, user, refreshUserData } = useSession();
  const [loading, setLoading] = useState(false);

  const handleRereshData = async () => {
    setLoading(true);
    try {
      await refreshUserData();
    } catch (error) {
      Toast.error("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text style={styles.title} numberOfLines={1}>
          Conta
        </Text>
      </View>
      <ScrollView
        style={styles.flatList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRereshData} />
        }
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 8,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <View style={{ display: "flex", gap: 8, marginBottom: 32 }}>
            <Label title="NOME" value={user?.name} />
            <Label title="EMAIL" value={user?.email} />
            <Label title="CARGO" value={user?.role} />
            <Label title="STATUS DA CONTA">
              <View
                style={{
                  marginTop: 4,
                  alignSelf: "flex-start",
                  padding: 4,
                  backgroundColor: user.is_active ? "green" : "red",
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "white" }}>
                  {user.is_active ? "ATIVADA" : "DESATIVADA"}
                </Text>
              </View>
            </Label>
          </View>
          <View style={{ gap: 8 }}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: "#c52822",
                },
              ]}
              onPress={signOut}
            >
              <Materialnicons name="logout" size={36} color={"#1A1A1A"} />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#1A1A1A",
                }}
              >
                SAIR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "bold" },
  flatList: {
    flex: 1,
    padding: 16,
    backgroundColor: "#e8e8e8",
  },
  card: {
    padding: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "#c8ccda",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    color: "#1A1A1A",
  },
  cardSid: {
    color: "#3b3b3b",
    fontWeight: "bold",
    fontSize: 22,
  },
  cardImage: {
    height: 128,
    marginVertical: 8,
    borderRadius: 4,
  },
  iconsView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
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
  button: {
    paddingVertical: 12,
    minHeight: 50,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
