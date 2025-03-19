import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Materialnicons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { api } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChecklistRoutesPrams } from "./routes";

interface checklistItem {
  id: string;
  created_at: Date;
  updated_at: Date;
  checklist_id: string;
  item_id: string;
  score: number | null;
  observation: string | null;
  image: string | null;
  is_inspected: boolean;
  item: {
    name: string;
  };
  images: {
    checklist_item_id: string;
    created_at: string;
    id: string;
    image: string;
    observation: string;
  }[];
}

export function PhotosScreen({ route }: any) {
  const checklist = route.params.checklist;

  const navigation =
    useNavigation<NativeStackNavigationProp<ChecklistRoutesPrams>>();

  const [checklistItem, setChecklistItem] = useState<checklistItem>(
    route.params.checklistItem || []
  );

  const [loading, setLoading] = useState(false);

  const handleSelectOrigin = () => {
    Alert.alert(
      "Origem da foto",
      "Selecione a origem da foto:",
      [
        {
          text: "Galeria",
          onPress: () => pickImage("LIBRARY"),
        },
        {
          text: "Camera",
          onPress: () => pickImage("CAMERA"),
        },
      ],
      {
        cancelable: true,
        onDismiss: () => 0,
      }
    );
  };

  const pickImage = async (from: "CAMERA" | "LIBRARY") => {
    let result;
    if (from === "CAMERA") {
      await ImagePicker.requestCameraPermissionsAsync();

      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        allowsEditing: false,
        selectionLimit: 10,
        aspect: [4, 3],
      });
    } else {
      await ImagePicker.requestMediaLibraryPermissionsAsync();

      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: 10,
        allowsEditing: false,
        aspect: [4, 3],
      });
    }

    if (!result.canceled) {
      setLoading(true);
      uploadFiles(result);
    }
  };

  const uploadFiles = async (result: ImagePicker.ImagePickerSuccessResult) => {
    try {
      const form = new FormData();
      form.append("folder", "images");
      for (let image of result.assets) {
        form.append("file", {
          type: "image/*",
          name: "fotoimage",
          uri:
            Platform.OS === "ios"
              ? image.uri.replace("file://", "")
              : image.uri,
        } as unknown as Blob);
      }

      const { data } = await axios.post(
        "http://http://172.16.146.58:3333/upload/images",
        form,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await api.put("/api/checklist-item/" + checklistItem.id + "/images", {
        images: data.files.map((file: any) => file.url),
      });
    } finally {
      setLoading(false);
    }
    getData();
  };

  const getData = async () => {
    setLoading(true);
    api
      .get("/api/checklist-item/" + checklistItem.id)
      .then(({ data }) => setChecklistItem(data))
      .finally(() => setLoading(false));
  };

  const CHECKLIST_IS_CLOSED = checklist?.status === "CLOSED";

  console.log(process.env.EXPO_PUBLIC_API_URL);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            flex: 1,
          }}
          numberOfLines={1}
        >
          {checklistItem?.item?.name}
        </Text>
        <TouchableOpacity
          onPress={handleSelectOrigin}
          disabled={CHECKLIST_IS_CLOSED}
          style={{ opacity: CHECKLIST_IS_CLOSED ? 0.5 : 1 }}
        >
          <Materialnicons name="add-a-photo" size={32} color={"#1A1A1A"} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={checklistItem?.images}
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: "#e8e8e8",
          shadowColor: "black",
          shadowOffset: {
            height: 2,
            width: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => getData()} />
        }
        renderItem={(item) => (
          <View key={item.item.id} style={styles.card}>
            <Image
              source={{
                uri: "http://172.16.146.58:3333" + item.item.image,
              }}
              style={{
                height: 220,
                flex: 1,
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <TouchableOpacity
              style={[
                styles.observation,
                { opacity: CHECKLIST_IS_CLOSED ? 0.5 : 1 },
              ]}
              disabled={false}
              onPress={() => {
                navigation.push("PhotoObservation", {
                  checklistItemPhoto: item.item,
                  checklist,
                });
              }}
            >
              {item.item.observation ? (
                <Text style={{ flex: 1 }}>{item.item.observation}</Text>
              ) : (
                <>
                  <Text>{"Adicionar Observação"}</Text>
                  <Materialnicons name="sms" size={26} color={"#1A1A1A"} />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
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
    borderColor: "#c8ccda",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardImage: {
    height: 128,
    marginVertical: 8,
    borderRadius: 4,
  },
  observation: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
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
});
