import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  View,
} from "react-native";
import {
  StaticScreenProps,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { Toast } from "toastify-react-native";

import * as ImagePicker from "expo-image-picker";
import { ChecklistRoutesProps } from "./routes";
import { api } from "../../services/api";
import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Header } from "../../components/ui/header";
import { PhotosItem } from "./components/photos-item";
import { CreateButton } from "../../components/create-button";

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

type Props = StaticScreenProps<{
  checklistItem: any;
  checklist: any;
}>;

export function PhotosListScreen({ route }: Props) {
  const focus = useIsFocused();

  const checklist = route.params.checklist;

  const navigation = useNavigation<ChecklistRoutesProps>();

  const [checklistItem, setChecklistItem] = useState<checklistItem>(
    route.params.checklistItem || []
  );
  const [refresh, setRefresh] = useState(true);

  const [loading, setLoading] = useState(true);

  const handleSelectOrigin = () => {
    Alert.alert(
      "Origem da foto",
      "Selecione a origem da foto:",
      [
        {
          text: "Galeria",
          isPreferred: true,
          onPress: () => pickImage("LIBRARY"),
        },
        {
          text: "Camera",
          onPress: () => pickImage("CAMERA"),
        },
        {
          text: "Cancelar",
          style: "destructive",
          onPress: () => null,
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

      const { data } = await api.post("/api/v1/upload", form, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      await api.put("/api/v1/checklist-items/" + checklistItem.id + "/images", {
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
    api
      .get("/api/v1/checklist-items/" + checklistItem.id)
      .then(({ data }) => setChecklistItem(data))
      .catch((e) => {
        if (e.response?.data?.message) {
          Toast.error(e.response.data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (focus) {
      getData();
    }
  }, [refresh, focus]);

  return (
    <BaseSafeAreaView>
      <Header
        backButton
        title={checklistItem?.item?.name}
        style={{
          borderBottomColor:
            checklist?.status === "OPEN" ? "#067C03" : "#FD0006",
        }}
      />
      <BaseView style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#1A3180", fontSize: 16, fontWeight: 400 }}>
            IMAGENS:
          </Text>
          <Text style={{ color: "#858586", fontSize: 16, fontWeight: 400 }}>
            {checklistItem?.images?.length}/10
          </Text>
        </View>
        <FlatList
          data={checklistItem?.images}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => setRefresh(!refresh)}
            />
          }
          ListFooterComponent={
            checklistItem.images?.length < 10 ? (
              <CreateButton
                title="INSERIR IMAGEM"
                onPress={handleSelectOrigin}
              />
            ) : null
          }
          renderItem={(item) => (
            <PhotosItem
              item={item}
              highlight={checklistItem?.image === item.item?.image}
              onSelect={() =>
                navigation.push("Photo", {
                  checklist,
                  checklistItem,
                  checklistItemPhoto: item.item,
                })
              }
            />
          )}
        />
      </BaseView>
    </BaseSafeAreaView>
  );
}
