import { SessionProvider, useSession } from "@/context/ctx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "./global.css";

function NavRootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoading, session } = useSession();
  useEffect(() => {
    if (isLoading) return;
    const isAuthGroup = segments[0] === "(auth)";
    if (session && isAuthGroup) {
      router.replace("/(app)");
    } else if (!session && !isAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [segments, session, router, isLoading]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#EE8130" />
      </View>
    );
  }
  return <Slot />;
}
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <NavRootLayout />
      </SessionProvider>
    </QueryClientProvider>
  );
}
