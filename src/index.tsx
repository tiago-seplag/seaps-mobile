import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useIsSignedIn, useIsSignedOut } from "./contexts/authContext";

import { Login } from "./app/auth/login";
import { HomeRoutes } from "./app/home/routes";
import { ChecklistRoutes } from "./app/checklist/routes";
import { PropertyRoutes } from "./app/property/routes";
import { AccountRoutes } from "./app/account/route";
import { CreateChecklistRoutes } from "./app/create-checklist/routes";
import { CreatePropertyRoutes } from "./app/create-property/route";

const AppStack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    HomeRoutes: HomeRoutes,
    AccountRoutes: AccountRoutes,
    ChecklistRoutes: ChecklistRoutes,
    PropertyRoutes: PropertyRoutes,
    CreateChecklist: CreateChecklistRoutes,
    CreateProperty: CreatePropertyRoutes,
  },
});

const MainStack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    AuthRoutes: {
      if: useIsSignedOut,
      screen: Login,
    },
    AppRoutes: {
      if: useIsSignedIn,
      screen: AppStack,
    },
  },
});

type RootStackParamList = StaticParamList<typeof AppStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default function Index() {
  return <Navigation />;
}

const Navigation = createStaticNavigation(MainStack);
