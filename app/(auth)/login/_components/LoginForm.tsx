import { useSession } from "@/context/ctx";
import { Ionicons } from "@expo/vector-icons"; // Pastikan sudah install icon
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { clsx } from "clsx";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginSchema, type LoginSchemaFormData } from "../_types";
import { login } from "../services";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setSession } = useSession();
  // 1. Setup React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaFormData>({
    resolver: zodResolver(loginSchema), // Sambungkan Zod disini
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: login, // Fungsi service dipanggil disini

    onSuccess: (data) => {
      console.log("✅ Login Berhasil:", data);
      setSession({
        token: data.token,
        id: String(data.id),
        name: data.username,
        email: data.email,
        avatar: data.image,
      });

      Alert.alert("Welcome!", `Halo, ${data.username}`);
      router.replace("/(app)");
    },

    onError: (error: AxiosError) => {
      // Error handling otomatis
      console.error("❌ Login Gagal:", error);
      const errorMessage =
        (error.response?.data as any)?.message || "Terjadi kesalahan server";
      Alert.alert("Login Gagal", errorMessage);
    },
  });

  // 4. Handle Submit (Trigger Mutation)
  const onSubmit = (formData: LoginSchemaFormData) => {
    mutation.mutate(formData);
  };

  return (
    <View className="w-full">
      {/* --- INPUT EMAIL --- */}
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2">Username</Text>

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={clsx(
                "border p-4 rounded-xl text-base bg-gray-50 text-gray-900",
                errors.username
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-blue-500",
              )}
              placeholder="agus"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {/* Error Message Email */}
        {errors.username && (
          <Text className="text-red-500 text-sm mt-1 ml-1">
            {errors.username.message}
          </Text>
        )}
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 font-medium mb-2">Password</Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="relative justify-center">
              <TextInput
                className={clsx(
                  "border p-4 rounded-xl text-base bg-gray-50 text-gray-900 pr-12",
                  errors.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500",
                )}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                // Logic Toggle Password
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />

              {/* Tombol Mata */}
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4"
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password && (
          <Text className="text-red-500 text-sm mt-1 ml-1">
            {errors.password.message}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={mutation.isPending}
        className={clsx(
          "p-4 rounded-xl items-center flex-row justify-center shadow-sm",
          mutation.isPending ? "bg-blue-400" : "bg-blue-600",
        )}
      >
        {mutation.isPending && (
          <ActivityIndicator color="white" className="mr-2" />
        )}
        <Text className="text-white font-bold text-lg">
          {mutation.isPending ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
