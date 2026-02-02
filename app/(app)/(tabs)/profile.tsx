import { useSession } from "@/context/ctx"; // Import Context
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { session, clearSession } = useSession(); // Ambil data session & fungsi logout

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <View className="mt-10 items-center">
        {/* Avatar */}
        <View className="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden items-center justify-center">
          {session?.avatar ? (
            <Image source={{ uri: session.avatar }} className="w-full h-full" />
          ) : (
            <Text className="text-4xl">👤</Text>
          )}
        </View>

        {/* Info User dari Session */}
        <Text className="text-xl font-bold text-gray-900">
          {session?.name || "User"}
        </Text>
        <Text className="text-gray-500 mb-8">
          {session?.email || "No Email"}
        </Text>

        {/* Tombol Logout */}
        <TouchableOpacity
          onPress={clearSession} // 👈 Panggil fungsi logout context
          className="bg-red-50 w-full py-4 rounded-xl items-center border border-red-100"
        >
          <Text className="text-red-600 font-bold">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
