import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import * as cookie from 'cookie';
import { getAuth } from 'firebase-admin/auth';
import { firebaseApp } from 'src/firebase';

export interface TUser {
  uid: string;
  username: string;
}

interface TMessage {
  type: string;
  video?: any;
  percent?: number;
  error?: string;
}

@Injectable()
@WebSocketGateway({
  path: '/io',
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*', // Allow all origins for CORS (configure as needed)
  },
})
export class SocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server | undefined;
  private logger: Logger = new Logger('SocketsGateway');
  private readonly connections: Map<string, Set<Socket>> = new Map();

  afterInit() {
    this.logger.log('Socket.IO server initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    let sessionCookie: string | undefined;
    try {
      const cookiesStr = client.handshake.headers.cookie!;
      sessionCookie = cookie.parse(cookiesStr).session;
    } catch (error) {
      this.logger.error(`Error parsing cookies: ${error}`);
      client.disconnect();
      return;
    }

    if (!sessionCookie) {
      this.logger.error('No session cookie found');
      client.disconnect();
      return;
    }

    const { uid } = await getAuth(firebaseApp).verifySessionCookie(
      sessionCookie,
      true,
    );

    if (!uid) {
      client.disconnect();
      return;
    }

    if (!this.connections.has(uid)) {
      this.connections.set(uid, new Set());
    }
    const userConnections = this.connections.get(uid)!;
    userConnections.add(client);

    client.on('disconnect', () => {
      this.logger.log(`Client disconnected: ${client.id}`);
      userConnections.delete(client);
    });
  }

  sendToUser(uid: string, message: TMessage) {
    const userConnections = this.connections.get(uid);
    if (userConnections) {
      userConnections.forEach((client) => {
        client.send(JSON.stringify(message));
      });
      return true;
    }
    return false;
  }

  handleDisconnect() {}

  getConnections() {
    return Object.fromEntries(
      Array.from(this.connections.entries()).map(([uid, clients]) => [
        uid,
        clients.size,
      ]),
    );
  }
}
