import React from "react";
import { View, Text } from "react-native";
import { s } from "./Home.styles";

interface WelcomeSectionProps {
  fullName?: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ fullName }) => {
  return (
    <View style={s.welcomeRow}>
      <View style={s.avatar}>
        <Text style={s.avatarText}>{(fullName?.[0] ?? "D").toUpperCase()}</Text>
      </View>
      <View>
        <Text style={s.welcomeSub}>Good day,</Text>
        <Text style={s.welcomeName}>{fullName ?? "Driver"}</Text>
      </View>
    </View>
  );
};
