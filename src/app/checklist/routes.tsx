import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChecklistScreen } from ".";
import { PhotosScreen } from "./photos";
import { PhotoObservationScreen } from "./photoObservation";
import { ObservationScreen } from "./observation";

export type ChecklistRoutesPrams = {
  Checklist: {
    id: string;
  };
  Photos: {
    checklistItem: any;
  };
  PhotoObservation: {
    checklistItemPhoto: any;
  };
  Observation: {
    checklistItem: any;
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
      <Stack.Screen name="Checklist" component={ChecklistScreen} />
      <Stack.Screen name="Photos" component={PhotosScreen} />
      <Stack.Screen name="Observation" component={ObservationScreen} />
      <Stack.Screen
        name="PhotoObservation"
        component={PhotoObservationScreen}
      />
    </Stack.Navigator>
  );
}
