import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeRoutes } from "./app/home/routes";
import { ChecklistRoutes } from "./app/checklist/routes";
import { useSession } from "./contexts/authContext";
import { Login } from "./app/auth/login";
import { ChecklistsRoutes } from "./app/checklists/routes";

export type RootStackParamList = {
  Initial: any;
  Checklists: any;
  Checklist: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Index() {
  const { session, isLoading, signOut } = useSession();

  return !session ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Initial"
    >
      <Stack.Screen name="Initial" component={HomeRoutes} />
      <Stack.Screen name="Checklists" component={ChecklistsRoutes} />
      <Stack.Screen name="Checklist" component={ChecklistRoutes} />
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
