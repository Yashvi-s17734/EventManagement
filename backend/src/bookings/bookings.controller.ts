// src/bookings/bookings.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBooking(@Req() req: any, @Body() dto: CreateBookingDto) {
    console.log('CREATE BOOKING → req.user:', req.user);
    if (!req.user?.userId)
      throw new UnauthorizedException('Missing user in token');
    return this.bookingService.createBooking(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyBookings(@Req() req: any) {
    console.log('GET /bookings/me → req.user =', req.user); // ← THIS LINE WILL SAVE YOUR LIFE

    if (!req.user?.userId) {
      throw new UnauthorizedException(
        'No user in JWT – token missing or invalid',
      );
    }

    return this.bookingService.getMyBookings(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('event/:eventId')
  async getEventBooking(@Req() req: any, @Param('eventId') eventId: string) {
    if (!['ORGANIZER', 'ADMIN'].includes(req.user.role)) {
      throw new UnauthorizedException('Forbidden');
    }
    return this.bookingService.getEventBookings(eventId);
  }

  @Get('verify/:qr')
  async verifyQr(@Param('qr') qr: string) {
    return this.bookingService.verifyQr(qr);
  }
}
