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
  constructor(private bookingService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBooking(@Req() req: any, @Body() dto: CreateBookingDto) {
    // ADD THIS SAFETY CHECK
    if (!req.user?.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    console.log('CREATE BOOKING – user from JWT:', req.user); // ← you will see this in logs

    return this.bookingService.createBooking(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyBookings(@Req() req: any) {
    // THIS IS THE MOST IMPORTANT PART
    console.log('GET /bookings/me – req.user =', req.user);

    if (!req.user?.userId) {
      throw new UnauthorizedException(
        'No user in token – invalid or missing JWT',
      );
    }

    return this.bookingService.getMyBookings(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('event/:eventId')
  async getEventBooking(@Req() req: any, @Param('eventId') eventId: string) {
    console.log('Event bookings request – user:', req.user);

    if (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'Only organizers can view event bookings',
      );
    }
    return this.bookingService.getEventBookings(eventId);
  }

  @Get('verify/:qr')
  async verifyQr(@Param('qr') qr: string) {
    return this.bookingService.verifyQr(qr);
  }
}
