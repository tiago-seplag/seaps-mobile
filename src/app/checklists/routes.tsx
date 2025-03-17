import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from ".";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

const Tab = createNativeStackNavigator();

export function ChecklistsRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ChecklistsScreen"
        component={HomeScreen}
        options={{
          headerTitle: "Checklists",
        }}
      />
    </Tab.Navigator>
  );
}
