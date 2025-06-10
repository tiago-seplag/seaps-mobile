import { Text, View } from "react-native";

export const PropertyBadge = ({ type }: { type: string }) => {
  const style = {
    backgroundColor: "#1a328020",
    label: "PRÓPRIO",
    color: "#1a3280",
    borderColor: "#1a3280",
  };

  switch (type) {
    case "RENTED":
      style.backgroundColor = "#ca8a0420";
      style.label = "ALUGADO";
      style.borderColor = "#ca8a04";
      style.color = "#ca8a04";
      break;
    case "GRANT":
      style.backgroundColor = "#dc262620";
      style.label = "CONCESSÃO";
      style.borderColor = "#dc2626";
      style.color = "#dc2626";
      break;
    default:
      break;
  }

  return (
    <View
      style={{
        padding: 4,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        borderWidth: 1,
        borderRadius: 6,
        minWidth: 90,
      }}
    >
      <Text
        style={{
          color: style.color,
          fontWeight: "bold",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        {style.label}
      </Text>
    </View>
  );
};
