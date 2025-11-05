import React from "react";
import { StyleSheet, View } from "react-native";

import RadioButton from "./RadioButton";
import { RadioGroupProps } from "./types";

export default function RadioGroup({
  accessibilityLabel,
  containerStyle,
  labelStyle,
  onPress,
  radioButtons,
  disabled,
  selectedId,
  testID,
}: RadioGroupProps) {
  function handlePress(id: string) {
    if (id !== selectedId) {
      if (onPress) {
        onPress(id);
      }
      const button = radioButtons.find((rb) => rb.id === id);
      if (button?.onPress) {
        button.onPress(id);
      }
    }
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radiogroup"
      style={[styles.container]}
      testID={testID}
    >
      {radioButtons.map((button) => (
        <RadioButton
          {...button}
          disabled={disabled}
          key={button.id}
          labelStyle={button.labelStyle || labelStyle}
          selected={button.id === selectedId}
          onPress={handlePress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    flexDirection: "column",
    flexWrap: "wrap",
  },
});
