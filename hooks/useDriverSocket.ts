import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './useAuth';
import { socketService } from '@/lib/socket';
import { setError, setOnlineStatus } from '@/store/slices/rideSlice';
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
  const { user, token, refreshToken, logout } = useAuth();
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

    const onDisconnect = async (reason: string) => {
      console.log('[socket] hook detecting disconnect:', reason);
      if (reason === 'io server disconnect') {
        console.log('[socket] token likely expired. Attempting refresh...');
        try {
          // Token expired, refresh it!
          // The new token will update the context, automatically triggering this useEffect
          // to naturally reconnect to the socket.
          await refreshToken();
        } catch (error) {
          console.error('[socket] failed to refresh token after socket drop:', error);
          dispatch(setError('Session expired. Please log in again.'));
          dispatch(setOnlineStatus(false));
          logout();
        }
      }
    };

    socket.on('error', onError);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('error', onError);
      socket.off('disconnect', onDisconnect);
    };
  }, [isOnline, token, user?.id, refreshToken, dispatch, logout]);

  return {};
};
