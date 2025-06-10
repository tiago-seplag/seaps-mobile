import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeRoutes } from "./app/home/routes";
import { ChecklistRoutes } from "./app/checklist/routes";
import { useSession } from "./contexts/authContext";
import { Login } from "./app/auth/login";
import { ChecklistsRoutes } from "./app/checklists/routes";
import { PropertiesRoutes } from "./app/properties/routes";
import { CreateChecklistsRoutes } from "./app/createChecklist/routes";
import { AccountRoutes } from "./app/account/route";
import { StaticParamList } from "@react-navigation/native";

// export type RootStackParamList = {
//   Initial: any;
//   Checklists: any;
//   Checklist: any;
//   Properties: any;
//   CreateChecklist: any;
//   AccountRoutes: any;
// };

const Stack = createNativeStackNavigator({
  screens: {
    Home: HomeRoutes,
    AccountRoutes: AccountRoutes,
    Checklists: ChecklistsRoutes,
    Properties: PropertiesRoutes,
    CreateChecklist: CreateChecklistsRoutes,
  },
});

type RootStackParamList = StaticParamList<typeof Stack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default function Index() {
  const { session } = useSession();

  return session ? (
    Stack
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
