import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,

        // tabBarStyle: {
        //   borderTopWidth: 1,
        //   borderTopColor: "#E5E7EB",
        //   height: 60,
        //   paddingBottom: 10,
        //   paddingTop: 10,
        // },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Pokédex",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "leaf" : "leaf-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
