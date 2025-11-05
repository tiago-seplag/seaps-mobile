import { Image, TouchableOpacity, View } from "react-native";
import { Card, CardTitle } from "../../../components/ui/card";
import { Icon } from "../../../components/icon";

export const PhotosItem = ({
  item,
  onSelect,
  highlight,
}: {
  item: any;
  onSelect: () => void;
  highlight?: boolean;
}) => {
  return (
    <TouchableOpacity key={item.item.id} onPress={onSelect}>
      <Card
        style={{
          borderColor: highlight ? "#EAB308" : "#c8ccda",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: process.env.EXPO_PUBLIC_BUCKET_URL + item.item.image,
          }}
          style={{
            height: 80,
            width: 80,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
        {item.item.observation ? (
          <CardTitle style={{ fontSize: 14, flex: 1 }} numberOfLines={2}>
            {item.item.observation}
          </CardTitle>
        ) : (
          <CardTitle
            style={{ fontSize: 14, flex: 1, color: "#858586" }}
            numberOfLines={2}
          >
            INSERIR DESCRIÇÃO
          </CardTitle>
        )}
        <Icon icon={"chevron-right"} style={{ backgroundColor: "#E8EAF2" }} />
      </Card>
    </TouchableOpacity>
  );
};
