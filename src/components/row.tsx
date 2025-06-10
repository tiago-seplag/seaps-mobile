import { View, ViewProps } from "react-native";

export const Row = ({ ...props }: ViewProps) => {
  return (
    <View
      style={{
        height: 4,
        borderRadius: 4,
        backgroundColor: "#B8BFD8",
        width: "100%",
      }}
      {...props}
    />
  );
};
