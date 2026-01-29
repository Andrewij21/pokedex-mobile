import { Ionicons } from "@expo/vector-icons"; // 1. Import Icon
import { clsx } from "clsx";
import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type InputType = "text" | "email" | "password" | "number";

interface FormInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
  inputClassName?: string;
  inputType?: InputType;
  disabled?: boolean;
}

const getInputProps = (type: InputType): Partial<TextInputProps> => {
  switch (type) {
    case "email":
      return {
        keyboardType: "email-address",
        autoCapitalize: "none",
        autoCorrect: false,
      };
    case "password":
      return {
        autoCapitalize: "none",
        // Note: secureTextEntry kita handle manual di component, bukan disini
      };
    case "number":
      return {
        keyboardType: "numeric",
      };
    default:
      return {};
  }
};

const FormMessage = ({ error }: { error?: string }) => {
  if (!error) return null;
  return (
    <Text className="text-red-500 text-sm mt-1 ml-1 font-medium">{error}</Text>
  );
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  className,
  inputClassName,
  inputType = "text",
  disabled = false,
  ...textInputProps
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = inputType === "password";

  const isSecureTextEntry = isPasswordType && !showPassword;

  const typeSpecificProps = getInputProps(inputType);

  return (
    <View className={clsx("mb-4", className)}>
      {label && (
        <Text
          className={clsx(
            "font-medium mb-2",
            disabled ? "text-gray-400" : "text-gray-700",
          )}
        >
          {label}
        </Text>
      )}

      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View className="relative justify-center">
              <TextInput
                className={clsx(
                  "border p-4 rounded-xl text-base",
                  error
                    ? "border-red-500 bg-red-50 text-red-900"
                    : "border-gray-200 bg-gray-50 text-gray-900",
                  !error && "focus:border-blue-500 focus:bg-white",
                  disabled && "bg-gray-200 text-gray-400 border-gray-200",
                  isPasswordType && "pr-12",
                  inputClassName,
                )}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!disabled}
                selectTextOnFocus={!disabled}
                secureTextEntry={isSecureTextEntry}
                {...typeSpecificProps}
                {...textInputProps}
              />

              {isPasswordType && (
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4"
                  // HitSlop biar area pencetnya lebih luas dikit
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              )}
            </View>
            <FormMessage error={error?.message} />
          </>
        )}
      />
    </View>
  );
}
