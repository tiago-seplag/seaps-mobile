import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../contexts/authContext";
import { useState } from "react";
import { Label } from "../../components/Label";
import { Toast } from "toastify-react-native";
import { StaticScreenProps } from "@react-navigation/native";
import { Button } from "../../components/ui/button";
import { Header } from "../../components/ui/header";
import { Card } from "../../components/ui/card";

type Props = StaticScreenProps<undefined>;

export function AccountScreen({}: Props) {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1A3180" }}>
      <Header title="Conta" icon="person" />
      <ScrollView
        style={styles.flatList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRereshData} />
        }
      >
        <Card style={styles.card}>
          <Label title="NOME" value={user?.name} />
          <Label title="EMAIL" value={user?.email} />
          <Label title="PERFIL" value={user?.role} />
          <Label title="STATUS DA CONTA">
            <View style={[label(user?.is_active)]}>
              <Text style={{ color: "white" }}>
                {user?.is_active ? "ATIVADA" : "DESATIVADA"}
              </Text>
            </View>
          </Label>
        </Card>
        <View style={{ gap: 12 }}>
          <Text style={{ color: "#1A3180", fontSize: 16, fontWeight: 400 }}>
            AÇÕES:
          </Text>
          <Button
            title="SAIR"
            icon={"logout"}
            color="#c52822"
            onPress={signOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F1F2F4",
  },
  label: {
    marginTop: 4,
    alignSelf: "flex-start",
    padding: 4,
    borderRadius: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 16,
  },
});

const label = (isActive: boolean) => ({
  marginTop: 4,
  alignSelf: "flex-start" as const,
  padding: 4,
  borderRadius: 4,
  backgroundColor: isActive ? "green" : "red",
});
