import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connecté: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté: ${client.id}`);
  }

  // Rejoindre une salle de réservation
  @SubscribeMessage('joinBooking')
  handleJoinBooking(
    @MessageBody() data: { bookingId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`booking:${data.bookingId}`);
    client.emit('joinedBooking', { bookingId: data.bookingId });
  }

  // Envoyer un message
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { bookingId: string; senderId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Sauvegarder en base
    const message = await this.prisma.message.create({
      data: {
        bookingId: data.bookingId,
        senderId: data.senderId,
        content: data.content,
      },
      include: {
        sender: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });

    // Diffuser dans la salle
    this.server.to(`booking:${data.bookingId}`).emit('newMessage', message);

    return message;
  }
}
