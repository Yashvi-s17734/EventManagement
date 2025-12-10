import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';


import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'event-banners',
    format: 'jpg',
    transformation: [{ width: 1200, height: 600, crop: 'fill' }]
  })
});


@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload-banner')
  @UseInterceptors(FileInterceptor('banner', { storage }))
  uploadBanner(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file received');
    }

    return {
      url: file.path, 
    };
  }

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
