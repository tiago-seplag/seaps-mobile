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
          // tabBarShowLabel: false,
          // tabBarIcon: () => (
          //   <Materialnicons name="home" size={32} color={"#1A1A1A"} />
          // ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerTitle: "Conta",
          headerBackVisible: false
          // tabBarShowLabel: false,
          // tabBarIcon: () => (
          //   <Materialnicons name="home" size={32} color={"#1A1A1A"} />
          // ),
        }}
      />
    </Tab.Navigator>
  );
}
