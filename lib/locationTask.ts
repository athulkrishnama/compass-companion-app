import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { socketService } from './socket';
import { store } from '@/store/store';

export const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('[location-task] error:', error);
    return;
  }

  if (data) {
    const state = store.getState();
    const vehicle = state.ride.vehicleDetails;

    if (!vehicle) {
      console.log('[location-task] No vehicle details found, skipping emit');
      return;
    }

    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];

    if (!location) return;

    const payload = {
      coordinates: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      heading: location.coords.heading ?? 0,
      vehicle_type: vehicle.type,
    };

    console.log('[location-task] emitting location:update', payload.coordinates);
    socketService.emit('location:update', payload);
  }
});
