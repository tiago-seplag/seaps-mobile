import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { EditProperty } from "./editProperty";
import { StaticParamList } from "@react-navigation/native";

type PropertiesParamList = StaticParamList<typeof PropertiesRoutes>;

export type PropertiesScreenNavigationProp = NativeStackNavigationProp<
  PropertiesParamList,
  "EditProperty"
>;

export const PropertiesRoutes = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    // CreateProperty,
    // CreateResponsible,
    EditProperty,
  },
});
