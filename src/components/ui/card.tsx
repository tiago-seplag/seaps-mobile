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
    shadowColor: "black",
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 12,
  },
});
