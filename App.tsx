import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SessionProvider } from "./src/contexts/authContext";
import Index from "./src";
import ToastManager from "toastify-react-native";

export type RootStackParamList = {
  Initial: any;
  Checklists: any;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <NavigationContainer>
          <Index />
          <ToastManager useModal={false} />
        </NavigationContainer>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
