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

export const BaseView = ({ style, ...props }: ViewProps) => {
  return <View style={[styles.view, style]} {...props} />;
};

export const BaseSafeAreaView = ({ style, ...props }: SafeAreaViewProps) => {
  return <SafeAreaView style={[styles.safeArea, style]} {...props} />;
};

export const BaseScrollView = ({ style, ...props }: ScrollViewProps) => {
  return <ScrollView style={[styles.view, style]} {...props} />;
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F1F2F4",
    flexDirection: "column",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#1a3280",
  },
});
