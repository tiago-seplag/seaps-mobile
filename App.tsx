import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "./src/contexts/authContext";
import Index from "./src";
import ToastManager from "toastify-react-native";
import { ChecklistProvider } from "./src/contexts/checklistContext";
import { Inter_300Light, useFonts } from "@expo-google-fonts/inter";
import { RobotoMono_300Light, RobotoMono_700Bold } from "@expo-google-fonts/dev";
import { StatusBar } from "expo-status-bar";

export type RootStackParamList = {
  Initial: any;
  Checklists: any;
};

export default function App() {
  let [fontsLoaded] = useFonts({
    mono: RobotoMono_300Light,
    MonoBold: RobotoMono_700Bold,
    Inter300: Inter_300Light,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <ChecklistProvider>
          <NavigationContainer>
            <Index />
            <StatusBar style="light" backgroundColor="#1A3180" />
            <ToastManager useModal={false} />
          </NavigationContainer>
        </ChecklistProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
