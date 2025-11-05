import { Text, View } from "react-native";

export const ScoreBadge = ({ score }: { score: number }) => {
  const style = {
    backgroundColor: "#1a3280",
    label: "PRÓPRIO",
    color: "#1a3280",
    borderColor: "#1a3280",
  };

  switch (score) {
    case 3:
      style.backgroundColor = "#22C55E";
      style.label = "BOM";
      break;
    case 1:
      style.backgroundColor = "#EAB308";
      style.label = "REGULAR";
      break;
    case 0:
      style.backgroundColor = "#4B5563";
      style.label = "N/A";
      break;
    case -2:
      style.backgroundColor = "#dc2626";
      style.label = "RUIM";
      break;
    default:
      break;
  }

  return (
    <View
      style={{
        width: 72,
        alignItems: "center",
        paddingVertical: 4,
        borderRadius: 6,
        ...style,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 12, color: "#FFFFFF" }}>
        {style.label}
      </Text>
    </View>
  );
};
