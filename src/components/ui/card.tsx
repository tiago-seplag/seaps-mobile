import { StyleSheet, Text, TextProps, View, ViewProps } from "react-native";

export const Card = ({ style, ...props }: ViewProps) => {
  return <View style={[{ ...styles.card }, style]} {...props} />;
};

export const CardHeader = ({ style, ...props }: ViewProps) => {
  return <View style={[{ ...styles.header }, style]} {...props} />;
};

export const CardTitle = ({ style, ...props }: TextProps) => {
  return <Text style={[styles.font, styles.cardTitle, style]} {...props} />;
};

export const CardText = ({ style, ...props }: TextProps) => {
  return <Text style={[styles.font, styles.cardText, style]} {...props} />;
};

const styles = StyleSheet.create({
  font: {
    color: "#0E1B46",
  },
  card: {
    borderWidth: 1,
    borderColor: "#c8ccda",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 8,
    gap: 4,
    padding: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    lineHeight: 22,
  },
  cardText: {
    fontSize: 12,
  },
});
