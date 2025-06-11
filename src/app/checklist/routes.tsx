import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { StaticParamList } from "@react-navigation/native";

import { ChecklistScreen } from "./checklist";
import { ChecklistItemsScreen } from "./checklist-items";
import { ChecklistItemScreen } from "./checklist-item";
import { ObservationScreen } from "./observation";
import { PhotosScreen } from "./photos";
import { PhotoObservationScreen } from "./photo-observation";

export const ChecklistRoutes = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    Checklist: ChecklistScreen,
    ChecklistItems: ChecklistItemsScreen,
    ChecklistItem: ChecklistItemScreen,
    Observation: ObservationScreen,
    Photos: PhotosScreen,
    PhotoObservation: PhotoObservationScreen,
  },
});

type ChecklistRoutesList = StaticParamList<typeof ChecklistRoutes>;

export type ChecklistRoutesProps =
  NativeStackNavigationProp<ChecklistRoutesList>;
