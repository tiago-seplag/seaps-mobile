import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { api } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChecklistRoutesPrams } from "./routes";
import { Toast } from "toastify-react-native";

export function ObservationScreen({ route }: any) {
  const checklist = route.params.checklist;

  const navigation =
    useNavigation<NativeStackNavigationProp<ChecklistRoutesPrams>>();

  const [checklistItem] = useState<ChecklistItem>(route.params.checklistItem);
  const [text, setText] = useState(
    route.params.checklistItem.observation || ""
  );
  const [loading, setLoading] = useState(false);

  const handleUpdateObservation = async () => {
    setLoading(true);
    await api
      .put("/api/checklist-item/" + checklistItem.id, {
        observation: text,
      })
      .then(() => navigation.goBack())
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text style={styles.title} numberOfLines={1}>
          {checklistItem.item.name}
        </Text>
      </View>
      <KeyboardAwareScrollView
        bounces={false}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: "#e8e8e8",
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
        enableAutomaticScroll={true}
      >
        <View key={checklistItem?.id} style={styles.card}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Observação:</Text>
          <TextInput
            defaultValue={checklistItem?.observation || ""}
            style={styles.input}
            multiline
            value={text}
            onChangeText={(e) => setText(e)}
            scrollEnabled={false}
            numberOfLines={4}
            autoCapitalize="characters"
            editable={checklist.status === "OPEN"}
            maxLength={255}
          />
          <View>
            <TouchableOpacity
              style={[
                {
                  width: "100%",
                  backgroundColor: "green",
                  alignItems: "center",
                  padding: 12,
                  borderRadius: 4,
                },
                { opacity: checklist?.status === "CLOSED" ? 0.5 : 1 },
              ]}
              disabled={checklist?.status === "CLOSED"}
              onPress={handleUpdateObservation}
            >
              <Text
                style={{ color: "white", fontSize: 24, fontWeight: "semibold" }}
              >
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    flex: 1,
    borderColor: "#c8ccda",
    borderRadius: 16,
    gap: 8,
    backgroundColor: "#fff",
    shadowColor: "black",
    shadowOffset: {
      height: 2,
      width: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    borderRadius: 4,
    alignItems: "flex-start",
    objectFit: "cover",
    justifyContent: "flex-start",
    flex: 1,
  },
  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#c8ccda",
    textAlignVertical: "top",
    minHeight: 110,
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
