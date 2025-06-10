import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AccountScreen } from "./account-screen";

const AccountRoutes = createNativeStackNavigator({
  screens: {
    Account: AccountScreen,
  },
});

export { AccountRoutes };
