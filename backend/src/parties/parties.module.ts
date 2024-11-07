import { Module } from '@nestjs/common';
import { PartiesService } from './parties.service';
import { PartiesController } from './parties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Party, PartySchema } from 'src/schemas/Party.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Party.name, schema: PartySchema }]),
    UsersModule
  ],
  controllers: [PartiesController],
  providers: [PartiesService],
  exports: [PartiesService]
})
export class PartiesModule {}
