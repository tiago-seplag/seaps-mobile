import { Text, View } from "react-native";

export const Label = ({
  title,
  value,
  children,
}: {
  title: string;
  value?: string | number | any;
  children?: any;
}) => {
  return (
    <View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {title}:
      </Text>
      {children ? (
        children
      ) : (
        <Text
          style={{
            fontSize: 18,
          }}
        >
          {value}
        </Text>
      )}
    </View>
  );
};
