import React, { useState } from "react";
import {
  View,
  Button,
  Modal,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
} from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import { useSession } from "../../contexts/authContext";
import * as Sharing from "expo-sharing";
import { Toast } from "toastify-react-native";

interface PDFButtonModalProps extends TouchableOpacityProps {
  id?: string;
}

export const PDFButtonModal: React.FC<PDFButtonModalProps> = ({
  id,
  ...props
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const downloadPdfFromApi = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const fileName = id.replaceAll("-", "") + ".pdf" || "file.pdf";
      const localPath = FileSystem.documentDirectory + fileName;

      const fileInfo = await FileSystem.getInfoAsync(localPath);

      if (!fileInfo.exists) {
        const download = await FileSystem.downloadAsync(
          process.env.EXPO_PUBLIC_API_URL + "/api/reports/" + id,
          FileSystem.documentDirectory + id.replaceAll("-", "") + ".pdf",
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

      setModalVisible(true);
    } catch (err) {
      Toast.error("Erro! Não foi possível baixar o PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={downloadPdfFromApi}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#1A1A1A",
            }}
          >
            GERAR RELATÓRIO
          </Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalHeader}>
          <Button
            title="Compartilhar"
            onPress={async () =>
              localUri &&
              Sharing.shareAsync(localUri, {
                mimeType: "application/pdf",
                UTI: "application/pdf",
                dialogTitle: "Compartilhar PDF",
              })
            }
          />
          <Button title="Fechar" onPress={() => setModalVisible(false)} />
        </View>

        {localUri ? (
          <WebView
            source={{ uri: localUri }}
            style={styles.webview}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            originWhitelist={["*"]}
          />
        ) : (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </Modal>
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
