import { Image } from "react-native";

export const ImageCard = ({ uri }: { uri: string }) => {
  return (
    <Image
      source={{
        uri: process.env.EXPO_PUBLIC_BUCKET_URL + uri,
      }}
      style={{
        minHeight: 298,
        maxHeight: 298,
        width: "auto",
        objectFit: "cover",
        backgroundColor: "#D9D9D9",
        borderRadius: 8,
      }}
    />
  );
};
