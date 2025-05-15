import { Control, Controller, FieldErrors } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import RNPickerSelect from "react-native-picker-select";

export const Select = ({
  control,
  label,
  errors,
  name,
  placeholder,
  defaultValue,
  errorMessage,
  onValueChange,
  isRequired = true,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  errorMessage?: string;
  placeholder: string;
  control: Control<any>;
  errors: FieldErrors;
  onValueChange?: (value: string) => void;
  isRequired?: boolean;
}) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{ required: isRequired }}
        render={({ field: { onChange, value, ref } }) => (
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <View style={[styles.picker]}>
              <RNPickerSelect
                value={value}
                onValueChange={(e) => {
                  onChange(e);
                  if (onValueChange) {
                    onValueChange(e);
                  }
                }}
                placeholder={{
                  label: placeholder || "Selecione...",
                }}
                style={{
                  inputIOS: {
                    fontSize: 14,
                    paddingBottom: 10,
                    paddingTop: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontFamily: "Poppins-Regular",
                  },
                  inputAndroid: {
                    fontSize: 14,
                    fontFamily: "Poppins-Regular",
                  },
                }}
                darkTheme
                textInputProps={{ pointerEvents: "none" }}
                items={[
                  { label: "Football", value: "football" },
                  { label: "Baseball", value: "baseball" },
                  { label: "Hockey", value: "hockey" },
                ]}
              />
            </View>
          </View>
        )}
      />
      {errorMessage && errors[name] ? (
        <Text style={styles.errorText}>* {errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "#f75656",
    marginLeft: 8,
    fontWeight: 600,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  picker: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: 40,
    fontSize: 14,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 4,
    borderRadius: 5,
  },
});
