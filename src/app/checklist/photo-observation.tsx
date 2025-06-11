import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { api } from "../../services/api";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { ChecklistRoutesProps } from "./routes";
import { Toast } from "toastify-react-native";

interface ChecklistItemImage {
  checklist_item_id: string;
  created_at: string;
  id: string;
  image: string;
  observation: string;
}

type Props = StaticScreenProps<{
  checklistItemPhoto: any;
  checklist: any;
}>;

export function PhotoObservationScreen({ route }: Props) {
  const navigation = useNavigation<ChecklistRoutesProps>();

  const [image] = useState<ChecklistItemImage>(route.params.checklistItemPhoto);

  const [text, setText] = useState(
    route.params.checklistItemPhoto.observation || ""
  );
  const [loading, setLoading] = useState(false);

  const handleUpdateObservation = async () => {
    setLoading(true);
    await api
      .put(
        "/api/checklist-item/" +
          image.checklist_item_id +
          "/images/" +
          image.id,
        {
          observation: text,
        }
      )
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
        <View key={image?.id} style={styles.card}>
          <Image
            source={{ uri: process.env.EXPO_PUBLIC_BUCKET_URL + image.image }}
            style={styles.cardImage}
          />
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Observação:</Text>
          <TextInput
            defaultValue={image?.observation}
            style={styles.input}
            multiline
            value={text}
            onChangeText={(e) => setText(e)}
            scrollEnabled={false}
            numberOfLines={4}
            autoCapitalize="characters"
            maxLength={255}
            editable={route.params.checklist.status !== "CLOSED"}
          />
          <View>
            <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: "green",
                alignItems: "center",
                padding: 12,
                borderRadius: 4,
                opacity: route.params.checklist.status === "CLOSED" ? 0.5 : 1,
              }}
              disabled={loading || route.params.checklist.status === "CLOSED"}
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
    fontSize: 32,
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
    height: 370,
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
