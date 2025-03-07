import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SessionProvider } from "./src/contexts/authContext";
import Index from "./src";

export type RootStackParamList = {
  Initial: any;
  Checklists: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <NavigationContainer>
          <Index />
        </NavigationContainer>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
