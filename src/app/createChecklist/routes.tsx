import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreateChecklist } from "./createChecklist";
import { SelectProperty } from "./selectProperty";
import { CreateProperty } from "./createProperty";
import { CreateResponsible } from "./createResponsible";

export const CreateChecklistsRoutes = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    CreateChecklistScreen: CreateChecklist,
    SelectProperty: SelectProperty,
    CreateProperty: CreateProperty,
    CreateResponsible: CreateResponsible,
  },
});
