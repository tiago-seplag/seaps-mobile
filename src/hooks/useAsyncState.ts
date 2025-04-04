import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return React.useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (value == null) {
    await AsyncStorage.removeItem(key);
  } else {
    await AsyncStorage.setItem(key, value);
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  React.useEffect(() => {
    AsyncStorage.getItem(key).then((value) => {
      setState(value);
    });
  }, [key]);

  const setValue = React.useCallback(
    async (value: string | null) => {
      if (value) {
        setState(value);
        await AsyncStorage.setItem(key, value);
      } else {
        await setStorageItemAsync(key, null);
        setState(null);
      }
    },
    [key]
  );

  return [state, setValue];
}
