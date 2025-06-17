import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EditProperty } from "./edit-property";

export const PropertyRoutes = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    EditProperty,
  },
});
