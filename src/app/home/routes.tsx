import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from ".";

const Tab = createBottomTabNavigator();

export function HomeRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}
