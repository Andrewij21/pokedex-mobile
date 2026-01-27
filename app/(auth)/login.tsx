import { useSession } from "@/context/ctx";
import { Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const { signIn } = useSession();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-extrabold text-gray-900 mb-2">
        Pokédex Login
      </Text>
      <Text className="text-gray-500 mb-8">Login to continue your journey</Text>

      <TouchableOpacity
        onPress={() => signIn()}
        className="bg-blue-600 w-full py-4 rounded-xl items-center shadow-lg shadow-blue-200"
      >
        <Text className="text-white font-bold text-lg">Sign In (Dummy)</Text>
      </TouchableOpacity>
    </View>
  );
}
