import React from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { IGetCabDetailsResponseDTO } from "@/types/cab";
import { s } from "./Home.styles";

interface VehicleCardProps {
  loading: boolean;
  error: string | null;
  cabDetails: IGetCabDetailsResponseDTO | null;
  onRefresh: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  loading,
  error,
  cabDetails,
  onRefresh,
}) => {
  const vehicle = cabDetails?.vehicleDetails;

  return (
    <View style={s.card}>
      {/* Card header */}
      <View style={s.cardHead}>
        <View style={s.cardHeadLeft}>
          <View style={s.cardIconWrap}>
            <MaterialCommunityIcons name="car-outline" size={16} color="#111" />
          </View>
          <Text style={s.cardTitle}>Vehicle Details</Text>
        </View>
        <TouchableOpacity
          onPress={onRefresh}
          style={s.refreshBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="refresh-outline" size={16} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Hairline divider */}
      <View style={s.divider} />

      {/* Body */}
      <View style={s.cardBody}>
        {loading ? (
          <View style={s.centerBlock}>
            <ActivityIndicator size="large" color="#111" />
            <Text style={s.mutedText}>Loading vehicle info…</Text>
          </View>
        ) : error ? (
          <View style={s.centerBlock}>
            <Ionicons name="alert-circle-outline" size={36} color="#aaa" />
            <Text style={[s.mutedText, { color: "#888" }]}>{error}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={onRefresh} activeOpacity={0.8}>
              <Text style={s.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : vehicle ? (
          <View style={{ gap: 14 }}>
            {/* Image carousel */}
            {vehicle.images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              >
                {vehicle.images.map((uri, idx) => (
                  <Image key={idx} source={{ uri }} style={s.vehicleImg} contentFit="cover" />
                ))}
              </ScrollView>
            )}

            {/* 2-col chips */}
            <View style={s.chipRow}>
              <InfoChip icon="car-sport-outline" label="Model" value={vehicle.model} />
              <InfoChip icon="layers-outline" label="Type" value={capitalize(vehicle.type)} />
            </View>

            <InfoRow icon="document-text-outline" label="Registration" value={vehicle.registrationNumber} />

          </View>
        ) : (
          <View style={s.centerBlock}>
            <MaterialCommunityIcons name="car-off" size={38} color="#ccc" />
            <Text style={s.mutedText}>No vehicle assigned yet.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// ── Helpers ──────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}) {
  return (
    <View style={s.infoRow}>
      <View style={s.infoIconWrap}>
        <Ionicons name={icon} size={15} color="#111" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function InfoChip({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}) {
  return (
    <View style={s.chip}>
      <View style={s.chipIconWrap}>
        <Ionicons name={icon} size={16} color="#111" />
      </View>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.chipValue}>{value}</Text>
    </View>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
