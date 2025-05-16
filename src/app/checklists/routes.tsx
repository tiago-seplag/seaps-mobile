import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from ".";
import { CreateChecklist } from "./createChecklist";

export type ChecklistsRoutesPrams = {
  ChecklistsScreen: any;
  CreateChecklist: any;
};

const Tab = createNativeStackNavigator<ChecklistsRoutesPrams>();

export function ChecklistsRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ChecklistsScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="CreateChecklist"
        component={CreateChecklist}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
