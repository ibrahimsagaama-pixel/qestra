import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  private get db() {
    return this.prisma as any;
  }

  async createProfile(userId: string, dto: CreateProviderDto) {
    const existing = await this.db.providerProfile.findUnique({ where: { userId } });

    if (existing) {
      throw new ConflictException('Un profil prestataire existe déjà');
    }

    return this.db.providerProfile.create({
      data: { userId, ...dto },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    });
  }

  async findAll(category?: string, city?: string) {
    return this.db.providerProfile.findMany({
      where: {
        ...(category && { category }),
        ...(city && { city: { contains: city, mode: 'insensitive' } }),
      },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        services: { where: { isActive: true }, take: 3 },
      },
      orderBy: { rating: 'desc' },
    });
  }

  async findOne(id: string) {
    const provider = await this.db.providerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true, phone: true } },
        services: { where: { isActive: true } },
        reviews: {
          include: { client: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!provider) throw new NotFoundException('Prestataire introuvable');
    return provider;
  }

  async getMyProfile(userId: string) {
    const provider = await this.db.providerProfile.findUnique({
      where: { userId },
      include: {
        services: true,
        bookings: {
          include: { client: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!provider) throw new NotFoundException('Profil prestataire introuvable');
    return provider;
  }

  async updateProfile(userId: string, dto: Partial<CreateProviderDto>) {
    return this.db.providerProfile.update({ where: { userId }, data: dto });
  }
}
