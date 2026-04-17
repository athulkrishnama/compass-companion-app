import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RideState {
  isOnline: boolean;
  error: string | null;
  rideId: string | null;
}

const initialState: RideState = {
  isOnline: false,
  error: null,
  rideId: null,
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
  },
});

export const { setOnlineStatus, setError, setRideId } = rideSlice.actions;

export default rideSlice.reducer;
