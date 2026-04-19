import axiosInstance from "@/axios/axiosInstance";
import { HttpResponse } from "@/types/auth";
import { IGetCabDetailsResponseDTO } from "@/types/cab";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setVehicleDetails, setOnlineStatus } from "@/store/slices/rideSlice";

interface UseCabDetailsResult {
  cabDetails: IGetCabDetailsResponseDTO | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCabDetails(): UseCabDetailsResult {
  const dispatch = useDispatch();
  const [cabDetails, setCabDetails] = useState<IGetCabDetailsResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<HttpResponse<IGetCabDetailsResponseDTO>>("/cab");
      if (res.data.success && res.data.data) {
        setCabDetails(res.data.data);
        dispatch(setVehicleDetails(res.data.data.vehicleDetails ?? null));
        dispatch(setOnlineStatus(res.data.data.isOnline));
      } else {
        setError(res.data.message ?? "Failed to load vehicle details.");
        dispatch(setVehicleDetails(null));
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      dispatch(setVehicleDetails(null));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { cabDetails, loading, error, refetch: fetchDetails };
}
