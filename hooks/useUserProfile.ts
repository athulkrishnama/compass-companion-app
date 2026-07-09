import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/axios/axiosInstance";
import { HttpResponse } from "@/types/auth";
import { VERIFICATION_STATUS } from "@/types/auth"; // Need to update types/auth.ts to include this

export interface IGetUserProfileResponseDTO {
  id: string;
  full_name: string;
  email: string;
  mobile?: string;
  date_of_birth?: Date;
  profile_image?: string;
  is_verified: VERIFICATION_STATUS;
  verfication_id_image?: string;
  rejection_reason?: string;
  is_google_login: boolean;
  is_blocked?: boolean;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<IGetUserProfileResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<HttpResponse<IGetUserProfileResponseDTO>>("/auth/profile");
      if (res.data.success && res.data.data) {
        setProfile(res.data.data);
      } else {
        setError(res.data.message ?? "Failed to load user profile.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetchProfile: fetchProfile };
}
