import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s } from "./Home.styles";

interface StatusCardProps {
  isOnline: boolean;
  onToggle: () => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({ isOnline, onToggle }) => {
  return (
    <View style={s.statusCardRow}>
      {/* Left side: Status Info */}
      <View style={{ gap: 2 }}>
        <Text style={s.statusLabel}>Current Status</Text>
        <Text style={[s.statusValue, { color: isOnline ? "#16a34a" : "#9ca3af" }]}>
          {isOnline ? "● Online" : "○ Offline"}
        </Text>
        {isOnline && <Text style={s.statusHelper}>Sharing location</Text>}
      </View>

      {/* Right side: Premium Toggle Button */}
      <TouchableOpacity
        style={[s.toggleBtnSmall, { backgroundColor: isOnline ? "#ef4444" : "#16a34a" }]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isOnline ? "pause-circle-outline" : "play-circle-outline"}
          size={18}
          color="#fff"
        />
        <Text style={s.toggleTextSmall}>
          {isOnline ? "Go Offline" : "Go Online"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
