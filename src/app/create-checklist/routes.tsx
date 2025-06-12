import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { StepOneScreen } from "./step-one";
import { StaticParamList } from "@react-navigation/native";
import { StepTwoScreen } from "./step-two";
import { StepThreeScreen } from "./step-three";

export const CreateChecklistRoutes = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    StepOne: StepOneScreen,
    StepTwo: StepTwoScreen,
    StepThree: StepThreeScreen,
  },
});

type CreateChecklistRoutesList = StaticParamList<typeof CreateChecklistRoutes>;

export type CreateChecklistRoutesProps =
  NativeStackNavigationProp<CreateChecklistRoutesList>;
