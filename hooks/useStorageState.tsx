import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
async function setStorageItemAsync(
  key: string,
  value: string | null,
): Promise<void> {
  if (Platform.OS === "windows") {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } else {
    if (value === null) SecureStore.deleteItemAsync(key);
    else SecureStore.setItemAsync(key, value);
  }
}

export function useStorageState(key: string) {
  const [state, setState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (Platform.OS === "web") {
      const value = localStorage.getItem(key);
      setState(value);
      setLoading(false);
    } else {
      SecureStore.getItemAsync(key).then((val) => {
        setState(val);
        setLoading(false);
      });
    }
  }, [key]);
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key],
  );

  return [state, setValue, loading] as const;
}
