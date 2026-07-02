import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  private get db() { return this.prisma as any; }

  async create(userId: string, dto: any) {
    const provider = await this.db.providerProfile.findUnique({ where: { userId } });
    if (!provider) throw new NotFoundException('Profil prestataire introuvable');

    return this.db.service.create({
      data: {
        providerId: provider.id,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        category: dto.category || provider.category,
      },
    });
  }

  async findByProvider(providerId: string) {
    return this.db.service.findMany({
      where: { providerId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(serviceId: string, userId: string) {
    const service = await this.db.service.findUnique({
      where: { id: serviceId },
      include: { provider: true },
    });
    if (!service) throw new NotFoundException('Service introuvable');
    if (service.provider.userId !== userId) throw new ForbiddenException('Accès refusé');

    return this.db.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    });
  }
}
