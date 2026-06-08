import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNetworkState } from "expo-network";

export default function NetworkStatus() {
  const networkState = useNetworkState();

  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1 ${
        networkState.isConnected ? "bg-green-100" : "bg-red-100"
      }`}
    >
      <Ionicons
        name={networkState.isConnected ? "wifi" : "cloud-offline"}
        size={14}
        color={networkState.isConnected ? "#16a34a" : "#dc2626"}
      />
      <Text
        className={`text-xs font-bold ${
          networkState.isConnected ? "text-green-700" : "text-red-700"
        }`}
      >
        {networkState.isConnected ? "Online" : "Offline"}
      </Text>
    </View>
  );
}
