import React from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="px-6"
        >
          <View className="mb-8">
            <Text className="text-3xl font-extrabold text-blue-900 mb-2">
              Pokédex Login
            </Text>
            <Text className="text-gray-500">
              Welcome back! Please enter your details.
            </Text>
          </View>
          <LoginForm />
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
