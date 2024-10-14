// TODO: fix websocket connection
import { isServer } from '@tanstack/react-query';

import { Socket, io } from 'socket.io-client';

class WS {
  #client: Socket | null = null;

  connect() {
    if (isServer) return;

    this.disconnect();

    // const socket = io("localhost:3101", {
    //     path: process.env.NEXT_PUBLIC_WS_PREFIX,
    //     transports: ["websocket", "polling"],
    // });

    const socket = io('localhost:3101', {
      path: '/io',
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('WebSocket Client Connected');
      console.log(socket.id);
    });
    socket.on('disconnect', () => {
      console.log('echo-protocol Client Closed');
    });

    socket.on('connect_error', (error) => {
      if (socket.active) {
        // temporary failure, the socket will automatically try to reconnect
      } else {
        // the connection was denied by the server
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.log(`IO connection error: ${error.message}`);
      }
    });

    this.#client = socket;

    return socket;
  }

  disconnect() {
    if (isServer) return;
    this.#client?.close();
    this.#client?.removeAllListeners();
    this.#client = null;
  }

  get isConnected() {
    return !!this.#client;
  }

  get client() {
    return this.#client;
  }
}

export const ws = new WS();
