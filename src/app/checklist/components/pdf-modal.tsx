import React from "react";
import { View, Modal, StyleSheet, Button } from "react-native";
import { WebView } from "react-native-webview";

import * as Sharing from "expo-sharing";

export const PDFModal = ({
  isVisible,
  handleCloseModal,
  uri,
}: {
  isVisible: boolean;
  uri: string;
  handleCloseModal: () => void;
}) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalHeader}>
        <Button
          title="Compartilhar"
          color={"white"}
          onPress={async () =>
            uri &&
            Sharing.shareAsync(uri, {
              mimeType: "application/pdf",
              UTI: "application/pdf",
              dialogTitle: "Compartilhar PDF",
            })
          }
        />
        <Button title="Fechar" color={"white"} onPress={handleCloseModal} />
      </View>
      <WebView
        source={{ uri: uri }}
        style={styles.webview}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        originWhitelist={["*"]}
      />
    </Modal>
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
    backgroundColor: "#1A3180",
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
