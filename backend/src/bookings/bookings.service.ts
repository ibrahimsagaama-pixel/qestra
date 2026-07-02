import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  private get db() {
    return this.prisma as any;
  }

  async create(clientId: string, dto: CreateBookingDto) {
    const service = await this.db.service.findUnique({ where: { id: dto.serviceId } });

    if (!service) throw new NotFoundException('Service introuvable');

    const booking = await this.db.booking.create({
      data: {
        clientId,
        providerId: dto.providerId,
        serviceId: dto.serviceId,
        eventType: dto.eventType,
        eventDate: new Date(dto.eventDate),
        guestCount: dto.guestCount,
        location: dto.location,
        notes: dto.notes,
        totalPrice: service.price,
        status: 'PENDING',
      },
      include: {
        service: true,
        provider: { select: { businessName: true, userId: true } },
        client: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    await this.notificationsService.create({
      userId: booking.provider.userId,
      title: 'Nouvelle réservation',
      body: `${booking.client.firstName} ${booking.client.lastName} a réservé "${service.name}"`,
      type: 'new_booking',
      data: { bookingId: booking.id },
    });

    return booking;
  }

  async findClientBookings(clientId: string) {
    return this.db.booking.findMany({
      where: { clientId },
      include: {
        service: true,
        provider: { select: { businessName: true, category: true, images: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findProviderBookings(userId: string) {
    const provider = await this.db.providerProfile.findUnique({ where: { userId } });
    if (!provider) throw new NotFoundException('Profil prestataire introuvable');

    return this.db.booking.findMany({
      where: { providerId: provider.id },
      include: {
        service: true,
        client: { select: { firstName: true, lastName: true, email: true, phone: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(bookingId: string, userId: string, status: string) {
    const booking = await this.db.booking.findUnique({
      where: { id: bookingId },
      include: { provider: true },
    });

    if (!booking) throw new NotFoundException('Réservation introuvable');

    const isProvider = booking.provider.userId === userId;
    const isClient = booking.clientId === userId;

    if (!isProvider && !isClient) throw new ForbiddenException('Accès refusé');

    const updated = await this.db.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        client: { select: { firstName: true, lastName: true } },
        provider: { select: { businessName: true, userId: true } },
        service: true,
      },
    });

    const notificationTitle = status === 'CONFIRMED' ? 'Réservation confirmée ✅' : 'Réservation annulée ❌';
    const notificationBody =
      status === 'CONFIRMED'
        ? `Votre réservation chez "${updated.provider.businessName}" a été confirmée`
        : `Votre réservation chez "${updated.provider.businessName}" a été annulée`;

    await this.notificationsService.create({
      userId: booking.clientId,
      title: notificationTitle,
      body: notificationBody,
      type: `booking_${status.toLowerCase()}`,
      data: { bookingId },
    });

    return updated;
  }

  async findOne(id: string) {
    const booking = await this.db.booking.findUnique({
      where: { id },
      include: {
        client: { select: { firstName: true, lastName: true, email: true, avatar: true } },
        provider: { select: { businessName: true, category: true } },
        service: true,
        messages: {
          include: { sender: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!booking) throw new NotFoundException('Réservation introuvable');
    return booking;
  }
}
