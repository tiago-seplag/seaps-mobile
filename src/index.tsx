import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeRoutes } from "./app/home/routes";
import { ChecklistRoutes } from "./app/checklist/routes";
import { useIsSignedIn, useIsSignedOut } from "./contexts/authContext";
import { Login } from "./app/auth/login";
import { PropertiesRoutes } from "./app/properties/routes";
import { CreateChecklistsRoutes } from "./app/createChecklist/routes";
import { AccountRoutes } from "./app/account/route";
import { CreatePropertyRoutes } from "./app/create-property/route";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";

const Stack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    Auth: {
      if: useIsSignedOut,
      screen: Login,
    },
    HomeRoutes: {
      if: useIsSignedIn,
      screen: HomeRoutes,
    },
    AccountRoutes: {
      if: useIsSignedIn,
      screen: AccountRoutes,
    },
    Checklist: {
      if: useIsSignedIn,
      screen: ChecklistRoutes,
    },
    Properties: {
      if: useIsSignedIn,
      screen: PropertiesRoutes,
    },
    CreateChecklist: {
      if: useIsSignedIn,
      screen: CreateChecklistsRoutes,
    },
    CreateProperty: {
      if: useIsSignedIn,
      screen: CreatePropertyRoutes,
    },
  },
});

type RootStackParamList = StaticParamList<typeof Stack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default function Index() {
  return <Navigation />;
}

const Navigation = createStaticNavigation(Stack);
