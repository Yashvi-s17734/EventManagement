import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async createTicket(eventId: string, dto: CreateTicketDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.ticket.create({
      data: {
        name: dto.name,
        price: dto.price,
        totalSeats: dto.totalSeats,
        availableSeats: dto.totalSeats,
        eventId: eventId,
      },
    });
  }

  async getTicketsByEvent(eventId: string) {
    return this.prisma.ticket.findMany({
      where: { eventId },
    });
  }
}
