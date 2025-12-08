import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  createEvent(@Body() dto: CreateEventDto, @Req() req: any) {
    if (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN') {
      throw new Error('Only organizers can create events');
    }
    return this.eventsService.createEvent(dto, req.user.userId);
  }
  @Get()
  getEvents(@Query() query: any) {
    return this.eventsService.getEvents(query);
  }
  @Get(':id')
  getEvent(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }
}
