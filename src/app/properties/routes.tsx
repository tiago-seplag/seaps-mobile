import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from ".";
import { CreateProperty } from "./createProperty";

const Tab = createNativeStackNavigator();

export function PropertiesRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="PropertiesScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="CreateProperty"
        component={CreateProperty}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
