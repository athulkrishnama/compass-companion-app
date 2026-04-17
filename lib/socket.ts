import { io, Socket } from 'socket.io-client';

class SocketService {
  public socket: Socket | null = null;
  private backendUrl: string;

  constructor() {
    const fullUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    this.backendUrl = fullUrl.replace('/api/v1', '');
  }

  /**
   * Create a fresh socket connection authenticated via JWT.
   * Destroys any existing socket first to avoid leaks.
   */
  public connect(driverId: string, token: string): Socket {
    if (this.socket) {
      this.disconnect();
    }

    console.log('[socket] connecting to', this.backendUrl);

    this.socket = io(this.backendUrl, {
      query: { driverId },
      auth: { token },
      // forceNew bypasses socket.io's URL multiplexing cache so new auth tokens apply safely
      forceNew: true,
      // polling → websocket upgrade; avoids ping-timeout on Android emulator
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('[socket] connected, id:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[socket] disconnected, reason:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[socket] connect_error:', err.message);
    });

    return this.socket;
  }

  /**
   * Cleanly tear down the socket.
   * Disables reconnection first so socket.io doesn't fight the teardown.
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.io.reconnection(false);
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      console.log('[socket] disconnected & cleaned up');
    }
  }

  public emit(event: string, data: unknown): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn(`[socket] cannot emit "${event}" — socket instance not initialized`);
    }
  }

  public get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
