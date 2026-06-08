import LoginForm from "@/components/login/LoginForm";
import LoginHeader from "@/components/login/LoginHeader";
import { Image } from "expo-image";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";

export default function Login() {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View className="items-center bg-white mt-10">
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 72, height: 72 }}
            contentFit="contain"
          />
          <Text className="mt-2 text-2xl font-bold tracking-wide text-black">
            Compass
          </Text>
        </View>

        <LoginHeader />
        <LoginForm />
        <View className="flex-1 items-center justify-center px-6 pb-8">
          <Image
            source={require("@/assets/images/taxi.png")}
            style={{ width: 280, height: 200 }}
            contentFit="contain"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
