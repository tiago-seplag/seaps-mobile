import { Text, View } from "react-native";

export const Label = ({
  title,
  value,
}: {
  title: string;
  value?: string | number | any;
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
      <Text
        style={{
          fontSize: 18,
        }}
      >
        {value}
      </Text>
    </View>
  );
};
