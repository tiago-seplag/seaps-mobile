import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Materialnicons from "@expo/vector-icons/MaterialIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from ".";

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
    </Tab.Navigator>
  );
}
