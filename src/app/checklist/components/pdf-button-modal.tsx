import { FC, useState } from "react";
import { StyleSheet, TouchableOpacityProps, Platform } from "react-native";
import { useSession } from "../../../contexts/authContext";
import { Toast } from "toastify-react-native";
import { Button } from "../../../components/ui/button";
import { PDFModal } from "./pdf-modal";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

interface PDFButtonModalProps extends TouchableOpacityProps {
  id?: string;
  checklist?: any;
}

export const PDFButtonModal: FC<PDFButtonModalProps> = ({ checklist, id }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const downloadPdfFromApi = async () => {
    if (!checklist) return;

    try {
      setLoading(true);

      const fileName =
        checklist.property.name.replaceAll(" ", "") +
        "_" +
        checklist.sid.replace("/", "_") +
        ".pdf";

      const localPath = FileSystem.documentDirectory + fileName;

      const fileInfo = await FileSystem.getInfoAsync(localPath);

      if (!fileInfo.exists) {
        const download = await FileSystem.downloadAsync(
          process.env.EXPO_PUBLIC_API_URL + "/api/reports/" + id,
          FileSystem.documentDirectory + fileName,
          {
            headers: {
              Cookie: "SESSION=" + session,
            },
          }
        );

        setLocalUri(download.uri);
      } else {
        if (Date.now() - fileInfo.modificationTime * 1000 > 600000) {
          await FileSystem.deleteAsync(fileInfo.uri);
          await downloadPdfFromApi();
          return;
        }
        setLocalUri(fileInfo.uri);
      }

      if (Platform.OS === "android") {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(FileSystem.documentDirectory + fileName);
        } else {
          Toast.error("Compartilhamento não disponível no dispositivo.");
        }
      } else {
        setModalVisible(true);
      }
    } catch (err) {
      Toast.error("Erro! Não foi possível baixar o PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        icon="description"
        title="RELATÓRIO"
        disabled={checklist?.status === "OPEN" || loading}
        loading={loading}
        text="Gerar relatório do checklist"
        onPress={downloadPdfFromApi}
      />
      {localUri && localUri ? (
        <PDFModal
          handleCloseModal={() => setModalVisible(false)}
          isVisible={modalVisible}
          uri={localUri}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  webview: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
