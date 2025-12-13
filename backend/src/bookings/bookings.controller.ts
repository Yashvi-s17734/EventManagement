import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createBooking(@Req() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(req.user.userId, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyBookings(@Req() req: any) {
    return this.bookingService.getMyBookings(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('event/:eventId')
  getEventBooking(@Req() req: any, @Param('eventId') eventId: string) {
    if (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN') {
      throw new Error('Only organizers can view event bookings');
    }
    return this.bookingService.getEventBookings(eventId);
  }
  @Get('verify/:qr')
  async verifyQr(@Param('qr') qr: string) {
    return this.bookingService.verifyQr(qr);
  }
}
