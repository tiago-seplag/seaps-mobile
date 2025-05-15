import { Control, Controller, FieldErrors } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";

export const Input = ({
  control,
  label,
  errors,
  name,
  placeholder,
  errorMessage,
}: {
  name: string;
  label: string;
  errorMessage?: string;
  placeholder: string;
  control: Control<any>;
  errors: FieldErrors;
}) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={placeholder}
            value={value}
            style={styles.input}
            onChangeText={onChange}
          />
        )}
      />
      {errorMessage && errors[name] ? (
        <Text style={styles.errorText}>* {errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    fontSize: 14,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 4,
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "#f75656",
    marginLeft: 8,
    fontWeight: 600,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "white",
    borderColor: "#3b3b3b",
    padding: 4,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    paddingVertical: 10,
    alignSelf: "flex-end",
    width: "30%",
    display: "flex",
    alignItems: "center",
  },
});
