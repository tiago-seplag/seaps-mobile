import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AccountScreen } from "./account-screen";

export type AccountRoutesPrams = {
  AccountScreen: any;
};

const Tab = createNativeStackNavigator<AccountRoutesPrams>();

export function AccountRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
