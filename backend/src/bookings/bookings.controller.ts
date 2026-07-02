import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { BookingStatus, User } from '@prisma/client';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // POST /bookings
  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(user.id, dto);
  }

  // GET /bookings/client — mes réservations (en tant que client)
  @Get('client')
  getClientBookings(@CurrentUser() user: User) {
    return this.bookingsService.findClientBookings(user.id);
  }

  // GET /bookings/provider — mes réservations reçues (en tant que prestataire)
  @Get('provider')
  getProviderBookings(@CurrentUser() user: User) {
    return this.bookingsService.findProviderBookings(user.id);
  }

  // GET /bookings/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  // PATCH /bookings/:id/status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body('status') status: BookingStatus,
  ) {
    return this.bookingsService.updateStatus(id, user.id, status);
  }
}
