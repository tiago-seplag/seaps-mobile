import { Image, TouchableOpacity, View } from "react-native";
import { Card, CardText, CardTitle } from "../../../components/ui/card";
import { PropertyBadge } from "../../../components/property-badge";
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
      <Card style={{ borderColor: highlight ? "#EAB308" : "#c8ccda" }}>
        <Image
          source={{
            uri: process.env.EXPO_PUBLIC_BUCKET_URL + item.item.image,
          }}
          style={{
            height: 70,
            width: 74,
            objectFit: "cover",
            flex: 1,
            borderRadius: 8,
          }}
        />
        <CardTitle style={{ fontSize: 22, flex: 1 }} numberOfLines={2}>
          {item.item.name}
        </CardTitle>
        <Icon icon={"chevron-right"} style={{ backgroundColor: "#E8EAF2" }} />
      </Card>
    </TouchableOpacity>
  );
};
