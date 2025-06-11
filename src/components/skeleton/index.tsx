import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ViewProps,
  View,
} from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

export const BaseView = (props: ViewProps) => {
  return <View style={styles.view} {...props} />;
};

export const BaseSafeAreaView = (props: SafeAreaViewProps) => {
  return <SafeAreaView style={styles.safeArea} {...props} />;
};

export const BaseScrollView = (props: ScrollViewProps) => {
  return <ScrollView style={styles.view} {...props} />;
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F1F2F4",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#1a3280",
  },
});
