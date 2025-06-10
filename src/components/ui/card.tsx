import {
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export const Card = ({ style, ...props }: TouchableOpacityProps) => {
  return (
    <TouchableOpacity style={[{ ...styles.card }, style]} {...props}>
      {props.children}
    </TouchableOpacity>
  );
};

export const CardTitle = ({ style, ...props }: TextProps) => {
  return (
    <Text style={[styles.font, styles.cardTitle, style]} {...props}>
      {props.children}
    </Text>
  );
};

export const CardText = ({ style, ...props }: TextProps) => {
  return (
    <Text style={[styles.font, styles.cardText, style]} {...props}>
      {props.children}
    </Text>
  );
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
