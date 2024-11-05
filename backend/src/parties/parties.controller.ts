import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PartiesService } from './parties.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('parties')
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createParty(@Body() createPartyDto: CreatePartyDto, @Request() req) {
    const createdBy = req.user._id

    return this.partiesService.create(createPartyDto, createdBy)
  }

  @Get()
  findAll() {
    return this.partiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartyDto: UpdatePartyDto) {
    return this.partiesService.update(+id, updatePartyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partiesService.remove(+id);
  }
}
