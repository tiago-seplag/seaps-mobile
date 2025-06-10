import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from "@react-navigation/native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();

  return (
    <SafeAreaView
      style={{
        paddingHorizontal: 20,
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "100%",
      }}
      edges={["bottom"]}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          shadowColor: "black",
          shadowOpacity: 0.4,
          shadowRadius: 3,
          shadowOffset: {
            height: 2,
            width: 0,
          },
        }}
      >
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <PlatformPressable
              href={buildHref(route.name, route.params)}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              key={index}
              style={{
                borderRadius: 16,
                height: 52,
                flex: 1,
                backgroundColor: isFocused ? "#E8EAF2" : undefined,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? "#182D74" : "#424242",
                  size: 32,
                })}
            </PlatformPressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
