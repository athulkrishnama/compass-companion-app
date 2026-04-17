import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './useAuth';
import { socketService } from '@/lib/socket';
import { setError } from '@/store/slices/rideSlice';
import { RootState } from '@/store/store';

/**
 * Manages the socket connection lifecycle.
 *
 * - Connects (with JWT in auth handshake) when the driver goes online.
 * - Disconnects cleanly when the driver goes offline or token is missing.
 * - Location events are emitted separately by locationTask.ts,
 *   which accesses the shared socketService singleton.
 */
export const useDriverSocket = () => {
  const { user, token } = useAuth();
  const dispatch = useDispatch();
  const isOnline = useSelector((state: RootState) => state.ride.isOnline);

  useEffect(() => {
    if (!isOnline || !token || !user?.id) {
      socketService.disconnect();
      return;
    }

    const socket = socketService.connect(user.id, token);

    const onError = (errorData: any) => {
      console.error('[socket] server error:', errorData);
      dispatch(setError(errorData?.message || 'An unknown socket error occurred.'));
    };

    socket.on('error', onError);

    return () => {
      socket.off('error', onError);
    };
  }, [isOnline, token]);

  return {};
};
