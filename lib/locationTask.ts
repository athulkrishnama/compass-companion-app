import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { socketService } from './socket';

export const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('[location-task] error:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];

    if (!location) return;

    const payload = {
      coordinates: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      heading: location.coords.heading ?? 0,
      vehicle_type: 'SUV',
    };

    console.log('[location-task] emitting location:update', payload.coordinates);
    socketService.emit('location:update', payload);
  }
});
