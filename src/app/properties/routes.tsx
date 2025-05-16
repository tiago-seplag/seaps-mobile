import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from ".";
import { CreateProperty } from "./createProperty";
import { CreateResponsible } from "./createResponsible";
import { EditProperty } from "./editProperty";

export type PropertyRoutesPrams = {
  PropertiesScreen: any;
  CreateProperty: any;
  CreateResponsible: any;
  EditProperty: {
    property: any;
  };
};

const Tab = createNativeStackNavigator<PropertyRoutesPrams>();

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
      <Tab.Screen
        name="CreateResponsible"
        component={CreateResponsible}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="EditProperty"
        component={EditProperty}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
