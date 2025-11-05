import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { StaticParamList } from "@react-navigation/native";
import { StepOneScreen } from "./step-one";
import { StepTwoScreen } from "./step-two";
import { StepThreeScreen } from "./step-three";
import { CreateResponsibleScreen } from "./create-responsible";

export const CreatePropertyRoutes = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    StepOne: StepOneScreen,
    StepTwo: StepTwoScreen,
    StepThree: StepThreeScreen,
    CreateResponsible: CreateResponsibleScreen,
  },
});

type CreatePropertyRoutesList = StaticParamList<typeof CreatePropertyRoutes>;

export type CreatePropertyRoutesProps =
  NativeStackNavigationProp<CreatePropertyRoutesList>;
