import { Text, View } from "react-native";

export const ChecklistBadge = ({ status }: { status?: string }) => {
  return (
    <View
      style={{
        padding: 4,
        backgroundColor: status === "OPEN" ? "#067C0320" : "#FD000620",
        borderColor: status === "OPEN" ? "#067C03" : "#FD0006",
        width: 72,
        borderWidth: 1,
        borderRadius: 6,
      }}
    >
      <Text
        style={{
          color: status === "OPEN" ? "#067C03" : "#FD0006",
          fontWeight: "bold",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        {status === "OPEN" ? "ABERTO" : "FECHADO"}
      </Text>
    </View>
  );
};
