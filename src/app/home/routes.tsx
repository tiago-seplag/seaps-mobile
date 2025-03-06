import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from ".";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

export function HomeRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "Checklists",
          tabBarShowLabel: false,
          tabBarIcon: () => (
            <Materialnicons name="home" size={32} color={"#1A1A1A"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
