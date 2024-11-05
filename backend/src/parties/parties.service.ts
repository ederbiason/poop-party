import { Injectable } from '@nestjs/common';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { Model, Types } from 'mongoose';
import { Party } from 'src/schemas/Party.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PartiesService {
  constructor(@InjectModel(Party.name) private partyModel: Model<Party>) { }

  async create(createPartyDto: CreatePartyDto, createdBy: string): Promise<Party> {
    const members = createPartyDto.members || []
    const isCreatorInMembers = members.some(member => member.userId === createdBy)

    if (!isCreatorInMembers) {
      members.push({ userId: createdBy, individualShits: 0 })
    }

    const newParty = new this.partyModel({
      ...createPartyDto,
      createdBy: new Types.ObjectId(createdBy),
      members: members.map(member => ({
        userId: new Types.ObjectId(member.userId),
        individualShits: member.individualShits || 0,
      })),
    })

    return newParty.save()
  }

  findAll() {
    return this.partyModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} party`;
  }

  update(id: number, updatePartyDto: UpdatePartyDto) {
    return `This action updates a #${id} party`;
  }

  remove(id: number) {
    return `This action removes a #${id} party`;
  }
}
