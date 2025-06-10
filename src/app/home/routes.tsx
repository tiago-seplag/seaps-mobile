import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ChecklistsScreen } from "./checklist-screen";
import { HomeScreen } from "./home-screen";
import { PropertiesScreen } from "./properties-screen";
import { TabBar } from "./components/tab-bar";

import Materialnicons from "@expo/vector-icons/MaterialIcons";

const HomeRoutes = createBottomTabNavigator({
  tabBar: TabBar,
  initialRouteName: "Home",
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        tabBarIcon: ({ color, size }) => (
          <Materialnicons name="home" size={size} color={color} />
        ),
      },
    },
    ChecklistsHomeScreen: {
      screen: ChecklistsScreen,
      options: {
        tabBarIcon: ({ color, size }) => (
          <Materialnicons name="checklist" size={size} color={color} />
        ),
      },
    },
    PropertiesHomeScreen: {
      screen: PropertiesScreen,
      options: {
        tabBarIcon: ({ color, size }) => (
          <Materialnicons name="apartment" size={size} color={color} />
        ),
      },
    },
  },
  screenOptions: {
    headerShown: false,
  },
});

export { HomeRoutes };
