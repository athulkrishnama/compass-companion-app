import React, { useEffect } from "react";
import { View, Alert, ScrollView, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/hooks/useAuth";
import { useDriverSocket } from "@/hooks/useDriverSocket";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useCabDetails } from "@/hooks/useCabDetails";
import { useUserProfile } from "@/hooks/useUserProfile";
import { VERIFICATION_STATUS } from "@/types/auth";
import { RootState } from "@/store/store";
import { setOnlineStatus } from "@/store/slices/rideSlice";

import { Header } from "@/components/home/Header";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { StatusCard } from "@/components/home/StatusCard";
import { VehicleCard } from "@/components/home/VehicleCard";
import { s } from "@/components/home/Home.styles";

export default function Index() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const isOnline = useSelector((state: RootState) => state.ride.isOnline);

  const {
    cabDetails,
    loading: cabLoading,
    error: cabError,
    refetch,
  } = useCabDetails();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile();

  const isBlocked = profile?.is_blocked === true;
  const isNotVerified = profile ? profile.is_verified !== VERIFICATION_STATUS.APPROVED : false;
  const cantGoOnline = isBlocked || isNotVerified;

  // We should force offline if they are online but not allowed
  useEffect(() => {
    if (cantGoOnline && isOnline) {
      dispatch(setOnlineStatus(false));
    }
  }, [cantGoOnline, isOnline, dispatch]);

  // Manages socket connection
  useDriverSocket();

  // Manages background location task + emitting
  const { errorMsg: locationError } = useLocationTracking(isOnline && !cantGoOnline);

  // Show location errors as alerts
  useEffect(() => {
    if (locationError) {
      Alert.alert("Location Error", locationError);
      dispatch(setOnlineStatus(false));
    }
  }, [locationError, dispatch]);

  const handleLogout = () => {
    if (isOnline) dispatch(setOnlineStatus(false));
    logout();
    router.replace("/login");
  };

  const toggleOnline = () => {
    if (cantGoOnline) {
      if (isBlocked) {
        Alert.alert("Account Blocked", "Your account has been blocked by the admin.");
      } else if (isNotVerified) {
        Alert.alert("Verification Pending", "Your account is not yet approved.");
      }
      return;
    }
    dispatch(setOnlineStatus(!isOnline));
  };

  return (
    <View style={s.root}>
      <Header onLogout={handleLogout} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeSection fullName={user?.full_name} />

        {cantGoOnline && (
          <View style={[s.card, { marginBottom: 16 }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Ionicons name="alert-circle" size={20} color="#111" />
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#111" }}>
                {isBlocked ? "Account Blocked" : "Verification Pending"}
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: "#555", lineHeight: 18 }}>
              {isBlocked 
                ? "Your account has been blocked by the admin. You cannot go online or accept rides." 
                : "Your account is pending verification. You cannot go online until approved."}
            </Text>
          </View>
        )}

        <StatusCard isOnline={isOnline} onToggle={toggleOnline} disabled={cantGoOnline} />

        <VehicleCard
          loading={cabLoading}
          error={cabError}
          cabDetails={cabDetails}
          onRefresh={refetch}
        />
      </ScrollView>
    </View>
  );
}
