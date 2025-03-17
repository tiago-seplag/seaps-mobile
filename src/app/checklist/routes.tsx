import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChecklistScreen } from ".";
import { PhotosScreen } from "./photos";
import { PhotoObservationScreen } from "./photoObservation";
import { ObservationScreen } from "./observation";

export type ChecklistRoutesPrams = {
  ChecklistScreen: {
    id: string;
  };
  Photos: {
    checklistItem: any;
    checklist: any;
  };
  PhotoObservation: {
    checklistItemPhoto: any;
    checklist: any;
  };
  Observation: {
    checklistItem: any;
    checklist: any;
  };
};

const Stack = createNativeStackNavigator<ChecklistRoutesPrams>();

export function ChecklistRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChecklistScreen" component={ChecklistScreen} />
      <Stack.Screen name="Photos" component={PhotosScreen} />
      <Stack.Screen name="Observation" component={ObservationScreen} />
      <Stack.Screen
        name="PhotoObservation"
        component={PhotoObservationScreen}
      />
    </Stack.Navigator>
  );
}
