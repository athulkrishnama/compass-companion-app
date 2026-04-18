import axiosInstance from "@/axios/axiosInstance";
import { HttpResponse } from "@/types/auth";
import { IGetCabDetailsResponseDTO } from "@/types/cab";
import { useCallback, useEffect, useState } from "react";

interface UseCabDetailsResult {
  cabDetails: IGetCabDetailsResponseDTO | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCabDetails(): UseCabDetailsResult {
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
      } else {
        setError(res.data.message ?? "Failed to load vehicle details.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { cabDetails, loading, error, refetch: fetchDetails };
}
