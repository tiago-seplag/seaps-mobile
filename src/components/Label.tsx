import { Text, View, ViewProps } from "react-native";

export const Label = ({
  title,
  value,
  children,
  ...props
}: ViewProps & {
  title: string;
  value?: string | number | any;
  children?: any;
}) => {
  return (
    <View {...props}>
      <Text
        style={{
          fontSize: 16,
          color: "#0E1B46",
        }}
      >
        {title}:
      </Text>
      {children ? (
        children
      ) : (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#0E1B46",
          }}
        >
          {value}
        </Text>
      )}
    </View>
  );
};
