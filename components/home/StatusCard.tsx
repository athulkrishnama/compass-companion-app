import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s } from "./Home.styles";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface StatusCardProps {
  isOnline: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({ isOnline, onToggle, disabled }) => {
  const vehicleDetails = useSelector((state: RootState) => state.ride.vehicleDetails);
  const isDisabled = disabled || (!vehicleDetails && !isOnline);

  return (
    <View style={s.statusCardRow}>
      <View style={{ gap: 2 }}>
        <Text style={s.statusLabel}>Current Status</Text>
        <Text style={[s.statusValue, { color: isOnline ? "#16a34a" : "#9ca3af" }]}>
          {isOnline ? "● Online" : "○ Offline"}
        </Text>
        {isOnline && <Text style={s.statusHelper}>Sharing location</Text>}
        {!vehicleDetails && !isOnline && (
          <Text style={[s.statusHelper, { color: "#ef4444" }]}>Assign vehicle to go online</Text>
        )}
      </View>

      {/* Right side: Premium Toggle Button */}
      <TouchableOpacity
        style={[
          s.toggleBtnSmall,
          { backgroundColor: isOnline ? "#ef4444" : isDisabled ? "#d1d5db" : "#16a34a" }
        ]}
        onPress={onToggle}
        activeOpacity={0.8}
        disabled={isDisabled}
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
