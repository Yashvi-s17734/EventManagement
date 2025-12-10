import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}
  @UseGuards(JwtAuthGuard)
  @Post(':eventId')
  createTicket(
    @Param('eventId') eventId: string,
    @Body() dto: CreateTicketDto,
    @Req() req: any,
  ) {
    if (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN') {
      throw new Error('Only organizers can create ticket types');
    }

    return this.ticketsService.createTicket(eventId, dto);
  }
  @Get(':eventId')
  getTickets(@Param('eventId') eventId: string) {
    return this.ticketsService.getTicketsByEvent(eventId);
  }
}
