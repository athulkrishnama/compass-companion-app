import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function LoginHeader() {
  return (
    <View className="bg-white items-center px-6 pb-4">
      <Text className="text-black text-center text-3xl font-bold leading-snug">
        Your next ride{"\n"}is just a{" "}
        <Text className="text-black font-extrabold">tap away.</Text>
      </Text>
    </View>
  );
}
