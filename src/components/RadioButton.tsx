import React from "react";
import {
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RadioButtonProps } from "./types";

export default function RadioButton({
  accessibilityLabel,
  backgroundColor,
  borderColor,
  borderSize = 2,
  color = "#444",
  containerStyle,
  description,
  descriptionStyle,
  disabled = false,
  id,
  label,
  labelStyle,
  layout = "row",
  onPress,
  selected = false,
  size = 24,
  testID,
}: RadioButtonProps) {
  const borderWidth = PixelRatio.roundToNearestPixel(borderSize);
  const sizeHalf = PixelRatio.roundToNearestPixel(size * 0.5);
  const sizeFull = PixelRatio.roundToNearestPixel(size);

  let orientation: any = { flexDirection: "row" };
  let margin: any = { marginLeft: 10 };

  if (layout === "column") {
    orientation = { alignItems: "center" };
    margin = { marginTop: 10 };
  }

  function handlePress() {
    if (onPress) {
      onPress(id);
    }
  }

  return (
    <TouchableOpacity
      accessibilityHint={
        typeof description === "string" ? description : undefined
      }
      accessibilityLabel={
        accessibilityLabel || (typeof label === "string" ? label : undefined)
      }
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={[
        styles.container,
        orientation,
        { opacity: disabled ? 0.5 : 1 },
        containerStyle,
        selected
          ? { backgroundColor }
          : { backgroundColor: backgroundColor + "30" },
      ]}
      testID={testID}
    >
      <Text
        style={[
          margin,
          labelStyle,
          { fontWeight: "bold" },
          selected ? { color: "#FFFFFF" } : { color: "#0B1536" },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          {
            borderWidth,
            justifyContent: "center",
            alignItems: "center",
            width: sizeFull,
            height: sizeFull,
            borderRadius: sizeHalf,
          },
          selected && { borderColor: "#FFFFFF" },
        ]}
      >
        {selected && (
          <View
            style={[
              {
                width: sizeHalf,
                height: sizeHalf,
                borderRadius: sizeHalf,
              },
              selected && { backgroundColor: "#FFFFFF" },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    marginHorizontal: 10,
    justifyContent: "space-between",
  },
});
