import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/useAuth";
import { useDriverSocket } from "@/hooks/useDriverSocket";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { navigate } from "expo-router/build/global-state/routing";
import { Image } from "expo-image";
import { View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NetworkStatus from "@/components/ui/NetworkStatus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setOnlineStatus } from "@/store/slices/rideSlice";
import { useEffect } from "react";

export default function Index() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const isOnline = useSelector((state: RootState) => state.ride.isOnline);

  // Manages socket connection
  useDriverSocket();

  // Manages background location task + emitting
  const { errorMsg: locationError } = useLocationTracking(isOnline);

  // Show location errors as alerts
  useEffect(() => {
    if (locationError) {
      Alert.alert("Location Error", locationError);
      dispatch(setOnlineStatus(false));
    }
  }, [locationError]);

  const handleLogout = () => {
    if (isOnline) dispatch(setOnlineStatus(false));
    logout();
    navigate("/login");
  };

  const toggleOnline = () => {
    dispatch(setOnlineStatus(!isOnline));
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between bg-white px-5 pt-14 pb-4">
        <NetworkStatus />
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

        <Button
          className="h-10 flex-row items-center gap-2 rounded-xl bg-red-500 px-4"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text className="text-sm font-semibold text-white">Logout</Text>
        </Button>
      </View>

      <View className="flex-1 items-center justify-center px-6 gap-4">
        <Text className="text-lg text-black">
          Welcome, {user?.full_name ?? "User"}!
        </Text>

        <Text
          className={`text-sm font-semibold ${isOnline ? "text-green-600" : "text-gray-400"}`}
        >
          {isOnline ? "● ONLINE — Sharing Location" : "○ OFFLINE"}
        </Text>

        <Button
          className={`h-14 w-48 rounded-2xl ${isOnline ? "bg-red-500" : "bg-green-600"}`}
          onPress={toggleOnline}
        >
          <Text className="text-base font-bold text-white">
            {isOnline ? "Go Offline" : "Go Online"}
          </Text>
        </Button>
      </View>
    </View>
  );
}
