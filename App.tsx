import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SessionProvider } from "./src/contexts/authContext";
import Index from "./src";
import ToastManager from "toastify-react-native";
import { ChecklistProvider } from "./src/contexts/checklistContext";

export type RootStackParamList = {
  Initial: any;
  Checklists: any;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <ChecklistProvider>
          <NavigationContainer>
            <Index />
            <ToastManager useModal={false} />
          </NavigationContainer>
        </ChecklistProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
