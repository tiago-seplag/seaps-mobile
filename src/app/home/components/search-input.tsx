import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

export const SearchInput = ({
  placeholder,
  style,
  disabled,
  ...props
}: {
  disabled?: boolean;
} & TextInputProps) => {
  return (
    <View style={[styles.container, style]}>
      <MaterialIcons name={"search"} size={24} color={"#ABACAD"} />
      <TextInput
        editable={!disabled}
        placeholder={placeholder}
        autoCapitalize="characters"
        autoCorrect={false}
        style={[styles.input]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 300,
    color: "#0E1B46",
  },
  container: {
    minHeight: 42,
    fontSize: 14,
    backgroundColor: "#FBFBFC",
    color: "#182D74",
    borderColor: "#6675AA",
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  input: {
    color: "#182D74",
    flex: 1,
  },
});
