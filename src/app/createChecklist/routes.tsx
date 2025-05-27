import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreateChecklist } from "./createChecklist";
import { SelectProperty } from "./selectProperty";
import { CreateProperty } from "./createProperty";
import { CreateResponsible } from "./createResponsible";

export type CreateChecklistsRoutesRoutesPrams = {
  ChecklistsScreen: any;
  CreateChecklistScreen: any;
  SelectProperty: any;
  CreateProperty: any;
  CreateResponsible: any;
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
      <Tab.Screen name="CreateProperty" component={CreateProperty} />
      <Tab.Screen name="CreateResponsible" component={CreateResponsible} />
    </Tab.Navigator>
  );
}
