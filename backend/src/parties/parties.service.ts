import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { Model, Types } from 'mongoose';
import { Party } from 'src/schemas/Party.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PartiesService {
  constructor(
    @InjectModel(Party.name) private partyModel: Model<Party>,
    private usersService: UsersService
  ) { }

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

  async addMemberToParty(partyId: string, email: string): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if(!party) throw new NotFoundException("Party não encontrada!") 

    const user = await this.usersService.findByEmail(email)
    if(!user) throw new NotFoundException("Usuário não encontrado!") 

    const isMember = party.members.some(member => member.userId.equals(user._id))
    if(isMember) throw new BadRequestException("Usuário já existe na party")

    party.members.push({userId: user._id, individualShits: 0})

    return party.save()
  }

  async addGoalToParty(partyId: string, targetShits: number): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if(!party) throw new NotFoundException("Party não encontrada!") 

    party.goals.push({ targetShits, completed: false })
    
    return party.save()
  }

  async updateIndividualShits(partyId: string, userId: string, amount: number): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if(!party) throw new NotFoundException("Party não encontrada!") 
    
    const member = party.members.find(member => member.userId.equals(userId))
    if (!member) throw new NotFoundException('Membro não encontrado na party')

    member.individualShits += amount
    if (member.individualShits < 0) member.individualShits = 0

    return party.save()
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
