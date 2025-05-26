import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeRoutes } from "./app/home/routes";
import { ChecklistRoutes } from "./app/checklist/routes";
import { useSession } from "./contexts/authContext";
import { Login } from "./app/auth/login";
import { ChecklistsRoutes } from "./app/checklists/routes";
import { PropertiesRoutes } from "./app/properties/routes";
import { CreateChecklistsRoutes } from "./app/createChecklist/routes";

export type RootStackParamList = {
  Initial: any;
  Checklists: any;
  Checklist: any;
  Properties: any;
  CreateChecklist: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Index() {
  const { session } = useSession();

  return session ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Initial"
    >
      <Stack.Screen name="Initial" component={HomeRoutes} />
      <Stack.Screen name="Checklists" component={ChecklistsRoutes} />
      <Stack.Screen name="Checklist" component={ChecklistRoutes} />
      <Stack.Screen name="Properties" component={PropertiesRoutes} />
      <Stack.Screen name="CreateChecklist" component={CreateChecklistsRoutes} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Initial"
    >
      <Stack.Screen name="Initial" component={Login} />
    </Stack.Navigator>
  );
}
