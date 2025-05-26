import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreateChecklist } from "./createChecklist";
import { SelectProperty } from "./selectProperty";

export type CreateChecklistsRoutesRoutesPrams = {
  ChecklistsScreen: any;
  CreateChecklistScreen: any;
  SelectProperty: any;
};

const Tab = createNativeStackNavigator<CreateChecklistsRoutesRoutesPrams>();

export function CreateChecklistsRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="CreateChecklistScreen" component={CreateChecklist} />
      <Tab.Screen name="SelectProperty" component={SelectProperty} />
    </Tab.Navigator>
  );
}
