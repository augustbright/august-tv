import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

interface TUser {
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
  path: '/websocket', // Change the path as needed
})
export class SocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly connections: Map<string, { ws: WebSocket; user: TUser }> =
    new Map();

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(ws: WebSocket, req) {
    const { uid, username } = req.query; // Extract user details from query
    const user: TUser = { uid, username };

    if (!uid || !username) {
      ws.close(); // Close the connection if no user is present
      return;
    }

    this.connections.set(user.uid, { ws, user });

    ws.addEventListener('message', (e) => {
      ws.send(e.data);
    });

    ws.addEventListener('close', () => {
      this.handleDisconnect(ws);
    });
  }

  handleDisconnect(ws: WebSocket) {
    // Find the user by the WebSocket and remove the connection
    const userEntry = Array.from(this.connections.values()).find(
      (conn) => conn.ws === ws,
    );

    if (userEntry) {
      this.connections.delete(userEntry.user.uid);
      console.log(`Connection closed for user: ${userEntry.user.uid}`);
    }
  }

  sendToUser(uid: string, message: TMessage) {
    const connection = this.connections.get(uid);
    if (connection) {
      connection.ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  getConnections() {
    return Array.from(this.connections.values()).map((conn) => ({
      user: conn.user,
    }));
  }
}
