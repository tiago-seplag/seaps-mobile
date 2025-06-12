import { View } from "react-native";

export const StepsCount = ({
  length = 3,
  step,
}: {
  length: number;
  step: number;
}) => {
  return (
    <View
      style={{
        width: "auto",
        gap: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {Array.from({ length: length }, (_, index) => index).map((_, index) => (
        <View
          key={index}
          style={{
            height: 8,
            width: index < step ? 32 : 16,
            backgroundColor: index < step ? "#182D74" : "#D9D9D9",

            borderRadius: 100,
          }}
        />
      ))}
    </View>
  );
};
