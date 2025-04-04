import { Text, View } from "react-native";

export const Badge = ({ status }: { status: string }) => {
  return (
    <View
      style={{
        padding: 4,
        backgroundColor: status === "OPEN" ? "green" : "red",
        borderRadius: 4,
      }}
    >
      <Text style={{ color: "white" }}>
        {status === "OPEN" ? "ABERTO" : "FECHADO"}
      </Text>
    </View>
  );
};
