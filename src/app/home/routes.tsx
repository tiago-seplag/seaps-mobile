import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from ".";
import { AccountScreen } from "./account";

const Tab = createNativeStackNavigator();

export function HomeRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "Home",
          headerTitleStyle: {
            fontSize: 26,
            fontWeight: "bold",
          },
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerTitle: "Conta",
          headerBackVisible: false,
        }}
      />
    </Tab.Navigator>
  );
}
