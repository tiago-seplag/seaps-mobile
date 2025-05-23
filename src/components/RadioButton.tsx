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

  const labelComp = React.isValidElement(label) ? (
    label
  ) : Boolean(label) ? (
    <Text style={[margin, labelStyle]}>{label}</Text>
  ) : null;
  const descComp = React.isValidElement(description) ? (
    description
  ) : Boolean(description) ? (
    <Text style={[margin, descriptionStyle]}>{description}</Text>
  ) : null;

  return (
    <>
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
          selected && { backgroundColor },
        ]}
        testID={testID}
      >
        <View
          style={[
            styles.border,
            {
              borderColor: borderColor || color,
              borderWidth,
              width: sizeFull,
              height: sizeFull,
              borderRadius: sizeHalf,
            },
          ]}
        >
          {selected && (
            <View
              style={{
                backgroundColor: color,
                width: sizeHalf,
                height: sizeHalf,
                borderRadius: sizeHalf,
              }}
            />
          )}
        </View>
        {labelComp}
      </TouchableOpacity>
      {descComp}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  border: {
    justifyContent: "center",
    alignItems: "center",
  },
});
