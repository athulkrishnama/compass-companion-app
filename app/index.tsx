import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/useAuth";
import { navigate } from "expo-router/build/global-state/routing";
import { Image } from "expo-image";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Bar with branding + logout */}
      <View className="flex-row items-center justify-between bg-white px-5 pt-14 pb-4">
        {/* Branding: Logo + Name */}
        <View className="flex-row items-center gap-2">
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 36, height: 36 }}
            contentFit="contain"
          />
          <Text className="text-xl font-bold tracking-wide text-black">
            Compass
          </Text>
        </View>

        {/* Logout Button */}
        <Button
          className="h-10 flex-row items-center gap-2 rounded-xl bg-red-500 px-4"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text className="text-sm font-semibold text-white">Logout</Text>
        </Button>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-lg text-black">
          Welcome, {user?.full_name ?? "User"}!
        </Text>
      </View>
    </View>
  );
}
