import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import NetworkStatus from "@/components/ui/NetworkStatus";
import { s } from "./Home.styles";

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <View style={s.header}>
      <NetworkStatus />

      <View style={s.logoRow}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: 36, height: 36 }}
          contentFit="contain"
        />
        <Text style={s.logoText}>Compass</Text>
      </View>

      <Button style={s.logoutBtn} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={s.logoutText}>Logout</Text>
      </Button>
    </View>
  );
};
