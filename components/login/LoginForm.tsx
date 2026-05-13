import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import axiosInstance from "@/axios/axiosInstance";
import { HttpResponse, LoginResponse } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { Mail, User } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

interface InputFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  value: string;
  onChangeText: (e: string) => void;
}

function InputField({
  icon,
  placeholder,
  secureTextEntry,
  keyboardType,
  value,
  onChangeText,
}: InputFieldProps) {
  return (
    <View
      className={cn(
        "border-border mb-4 flex-row items-center rounded-xl border bg-white px-4 py-3",
      )}
    >
      <View className="mr-3">{icon}</View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        className="flex-1 text-base text-black"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post<HttpResponse<LoginResponse>>(
        "/auth/login",
        { email, password },
      );

      if (data.success && data.data) {
        await login(data.data);
        router.replace("/");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials.");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      Alert.alert("Login Failed", message + process.env.EXPO_PUBLIC_BACKEND_URL);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white px-6 pb-6 pt-4">
      <Text className="mb-2 text-center text-2xl font-bold text-black">
        Login
      </Text>

      <InputField
        icon={<User size={20} color="#6b7280" />}
        placeholder="Email"
        value={email}
        onChangeText={(e) => setEmail(e.trim())}
      />
      <InputField
        icon={<Mail size={20} color="#6b7280" />}
        placeholder="Password"
        secureTextEntry
        keyboardType="default"
        value={password}
        onChangeText={(e) => setPassword(e.trim())}
      />

      <Button
        className="mt-2 h-12 rounded-xl bg-black"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-base font-semibold text-white">Login</Text>
        )}
      </Button>
    </View>
  );
}
