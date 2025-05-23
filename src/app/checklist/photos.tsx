import { useEffect, useState } from "react";
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
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChecklistRoutesPrams } from "./routes";
import { Toast } from "toastify-react-native";
import { api } from "../../services/api";

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
  const focus = useIsFocused();

  const checklist = route.params.checklist;

  const navigation =
    useNavigation<NativeStackNavigationProp<ChecklistRoutesPrams>>();

  const [checklistItem, setChecklistItem] = useState<checklistItem>(
    route.params.checklistItem || []
  );
  const [refresh, setRefresh] = useState(true);

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
        quality: 0.5,
        allowsEditing: false,
        selectionLimit: 10 - checklistItem.images.length,
        aspect: [4, 3],
      });
    } else {
      await ImagePicker.requestMediaLibraryPermissionsAsync();

      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.5,
        selectionLimit: 10 - checklistItem.images.length,
        allowsEditing: false,
        aspect: [4, 3],
      });
    }

    if (!result.canceled) {
      uploadFiles(result);
    }
  };

  const uploadFiles = async (result: ImagePicker.ImagePickerSuccessResult) => {
    try {
      setLoading(true);
      const form = new FormData();
      for (let image of result.assets) {
        form.append("file", {
          type: image.mimeType || "image/jpeg",
          name: Date.now().toString(),
          uri:
            Platform.OS === "ios"
              ? image.uri.replace("file://", "")
              : image.uri,
        } as unknown as Blob);
      }
      form.append("folder", "photos");

      const { data } = await api.post("/api/upload", form, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      await api.put("/api/checklist-item/" + checklistItem.id + "/images", {
        images: data.files.map((file: any) => file.url),
      });
    } catch (e: any) {
      if (e.response?.data?.message) {
        return Toast.error(e.response.data.message);
      }
      Toast.error(`Erro ao subir a imagem`);
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
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (focus && !loading) {
      getData();
    }
  }, [refresh, focus]);

  const handleDeleteImage = (imageId: string) => {
    Alert.alert(
      "Você tem certeza absoluta?",
      "Esta ação não pode ser desfeita. Isso excluirá permanentemente essa imagem.",
      [
        {
          text: "Sim",
          onPress: () => onDeleteImage(imageId),
        },
        {
          text: "Não",
          onPress: () => "",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => 0,
      }
    );
  };

  async function onDeleteImage(imageId: string) {
    setLoading(true);

    await api
      .delete("/api/checklist-item/" + checklistItem.id + "/images/" + imageId)
      .then(() => {
        Toast.success("Imagem deletada com sucesso");
        getData();
      })
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      })
      .finally(() => setLoading(false));
  }

  async function handleUpdateChecklistImage(image: string) {
    api
      .put("/api/checklist-item/" + checklistItem.id, {
        image: image,
      })
      .then(() => {
        Toast.success("Item atulizado com sucesso");
        getData();
      })
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      });
  }

  const CHECKLIST_IS_CLOSED = checklist?.status === "CLOSED";

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
          disabled={CHECKLIST_IS_CLOSED || checklistItem.images.length >= 10}
          style={{
            opacity:
              CHECKLIST_IS_CLOSED || checklistItem.images.length >= 10
                ? 0.5
                : 1,
          }}
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
          <RefreshControl
            refreshing={loading}
            onRefresh={() => setRefresh(!refresh)}
          />
        }
        renderItem={(item) => {
          const IS_PRINCIPAL_IMAGE = checklistItem?.image === item.item?.image;

          return (
            <View key={item.item.id} style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                }}
              >
                <TouchableOpacity
                  disabled={IS_PRINCIPAL_IMAGE || CHECKLIST_IS_CLOSED}
                  style={{ opacity: CHECKLIST_IS_CLOSED ? 0.5 : 1 }}
                  onPress={() => handleUpdateChecklistImage(item.item.image)}
                >
                  <Materialnicons
                    name="star"
                    size={32}
                    color={IS_PRINCIPAL_IMAGE ? "#e4c204" : "#1A1A1A"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={CHECKLIST_IS_CLOSED}
                  style={{ opacity: CHECKLIST_IS_CLOSED ? 0.5 : 1 }}
                  onPress={() => handleDeleteImage(item.item.id)}
                >
                  <Materialnicons name="delete" size={32} color={"#ef4444"} />
                </TouchableOpacity>
              </View>
              <Image
                source={{
                  uri: process.env.EXPO_PUBLIC_BUCKET_URL + item.item.image,
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
                <>
                  <Text>{"Adicionar Observação"}</Text>
                  <Materialnicons name="sms" size={26} color={"#1A1A1A"} />
                </>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
  },
  card: {
    paddingBottom: 16,
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
