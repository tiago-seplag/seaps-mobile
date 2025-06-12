import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./app/auth/login";
import { HomeRoutes } from "./app/home/routes";
import { ChecklistRoutes } from "./app/checklist/routes";
import { useIsSignedIn, useIsSignedOut } from "./contexts/authContext";
import { PropertiesRoutes } from "./app/properties/routes";
import { AccountRoutes } from "./app/account/route";
import { CreateChecklistRoutes } from "./app/create-checklist/routes";
import { CreatePropertyRoutes } from "./app/create-property/route";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";

const AppStack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    HomeRoutes: HomeRoutes,
    AccountRoutes: AccountRoutes,
    Checklist: ChecklistRoutes,
    Properties: PropertiesRoutes,
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
