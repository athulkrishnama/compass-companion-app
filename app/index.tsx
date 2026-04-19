import React, { useEffect } from "react";
import { View, Alert, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { useDriverSocket } from "@/hooks/useDriverSocket";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useCabDetails } from "@/hooks/useCabDetails";
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
  }, [locationError, dispatch]);

  const handleLogout = () => {
    if (isOnline) dispatch(setOnlineStatus(false));
    logout();
    router.replace("/login");
  };

  const toggleOnline = () => {
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

        <StatusCard isOnline={isOnline} onToggle={toggleOnline} />

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
