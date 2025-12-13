import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import * as QRCode from 'qrcode';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    const { ticketId, quantity } = dto;

    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket type not found!');

    if (ticket.availableSeats < quantity) {
      throw new BadRequestException(
        `Only ${ticket.availableSeats} seats available`,
      );
    }

    const eventId = ticket.eventId;
    const totalPrice = ticket.price * quantity;

    const qrText =
      'EVT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log('QR TEXT GENERATED =', qrText);

    const qrBuffer = await QRCode.toBuffer(qrText);

    const qrCloudinaryUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'qr-codes',
          format: 'png',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error('Cloudinary returned no result'));
          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(qrBuffer).pipe(uploadStream);
    });

    return this.prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { id: ticketId },
        data: { availableSeats: ticket.availableSeats - quantity },
      });

      const booking = await tx.booking.create({
        data: {
          userId,
          ticketId,
          eventId,
          quantity,
          totalPrice,
          qrCode: qrText,
          qrImage: qrCloudinaryUrl,
        },
      });

      return booking;
    });
  }

  async getMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        event: true,
        ticket: true,
      },
    });
  }

  async getEventBookings(eventId: string) {
    return this.prisma.booking.findMany({
      where: { eventId },
      include: {
        user: true,
        ticket: true,
      },
    });
  }
  async verifyQr(qrCode: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { qrCode },
      include: {
        user: true,
        event: true,
        ticket: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Invalid QR Code');
    }

    return {
      valid: true,
      booking,
    };
  }
}
