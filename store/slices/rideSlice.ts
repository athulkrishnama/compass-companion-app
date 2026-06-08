import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle } from '@/types/cab';

interface RideState {
  isOnline: boolean;
  error: string | null;
  rideId: string | null;
  vehicleDetails: Vehicle | null;
}

const initialState: RideState = {
  isOnline: false,
  error: null,
  rideId: null,
  vehicleDetails: null,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setRideId(state, action: PayloadAction<string | null>) {
      state.rideId = action.payload;
    },
    setVehicleDetails(state, action: PayloadAction<Vehicle | null>) {
      state.vehicleDetails = action.payload;
    },
  },
});

export const { setOnlineStatus, setError, setRideId, setVehicleDetails } = rideSlice.actions;

export default rideSlice.reducer;
