import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { LOCATION_TASK_NAME } from '@/lib/locationTask';
import { socketService } from '@/lib/socket';


export const useLocationTracking = (isOnline: boolean) => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        setErrorMsg('Foreground location permission denied.');
        setHasPermissions(false);
        return;
      }

      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        setErrorMsg('Background location permission denied. App may not work when minimized.');
        setHasPermissions(false);
        return;
      }

      setHasPermissions(true);
      setErrorMsg(null);
    })();
  }, []);

  // Start / stop the background location task based on online status
  useEffect(() => {
    let foregroundInterval: ReturnType<typeof setInterval>;

    const startTracking = async () => {
      if (!hasPermissions) return;

      try {
        const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (!alreadyRunning) {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,       // emit every 5 seconds
            distanceInterval: 0,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
              notificationTitle: 'Compass Companion',
              notificationBody: 'Your location is being tracked for active rides.',
              notificationColor: '#22c55e',
            },
          });
        }

        console.log('[location] tracking started');

        foregroundInterval = setInterval(async () => {
          try {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            if (loc) {
              const payload = {
                coordinates: {
                  latitude: loc.coords.latitude,
                  longitude: loc.coords.longitude,
                },
                heading: loc.coords.heading ?? 0,
                vehicle_type: 'SUV',
              };
              socketService.emit('location:update', payload);
              console.log('[interval] emitting location:update', payload.coordinates);
            }
          } catch (e) {
            console.error('[interval] failed to get position', e);
          }
        }, 5000);

      } catch (e: any) {
        console.error('[location] failed to start tracking:', e);
        setErrorMsg(e.message || 'Location tracking failed to start.');
      }
    };

    const stopTracking = async () => {
      if (foregroundInterval) clearInterval(foregroundInterval);

      try {
        const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (isRunning) {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }
        console.log('[location] tracking stopped');
      } catch (e: any) {
        if (!e.message?.includes('TaskNotFoundException')) {
          console.error('[location] failed to stop tracking:', e);
        }
      }
    };

    if (isOnline) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isOnline, hasPermissions]);

  return { hasPermissions, errorMsg };
};
