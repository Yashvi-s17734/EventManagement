import { Injectable } from '@nestjs/common';
import { PrismaService } from "../../prisma/prisma.service";
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}
  async createEvent(dto: CreateEventDto, organizerId: string) {
    return this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        location: dto.location,
        date: new Date(dto.date),
        banner: dto.banner || null,
        organizerId,
      },
    });
  }
  async getEvents(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.category) where.category = query.category;
    if (query.search)
      where.title = { contains: query.search, mode: 'insensitive' };
    if (query.date)
      where.date = {
        gte: new Date(query.date),
        lt: new Date(query.date + 'T23:59:59'),
      };

    const events = await this.prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'asc' },
    });

    const total = await this.prisma.event.count({ where });

    return {
      events,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  getEventById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }
}
