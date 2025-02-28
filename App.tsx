import { NavigationContainer } from "@react-navigation/native";
import { HomeRoutes } from "./src/app/home/routes";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ChecklistRoutes,
  ChecklistRoutesPrams,
} from "./src/app/checklist/routes";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Initial: any;
  Checklists: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Initial"
        >
          <Stack.Screen name="Initial" component={HomeRoutes} />
          <Stack.Screen name="Checklists" component={ChecklistRoutes} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
