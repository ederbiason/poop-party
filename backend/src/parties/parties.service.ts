import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

  private checkPartyCreator(party: Party, userId: string) {
    if (!party.createdBy.equals(userId)) {
      throw new ForbiddenException("Somente o criador da party pode executar essa ação.")
    }
  }

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

  async addMemberToParty(partyId: string, userId: string, email: string): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if(!party) throw new NotFoundException("Party não encontrada!") 

    this.checkPartyCreator(party, userId)

    const user = await this.usersService.findByEmail(email)
    if(!user) throw new NotFoundException("Usuário não encontrado!") 

    const isMember = party.members.some(member => member.userId.equals(user._id))
    if(isMember) throw new BadRequestException("Usuário já existe na party")

    party.members.push({userId: user._id, individualShits: 0})

    return party.save()
  }

  async addGoalToParty(partyId: string, userId: string, targetShits: number): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if(!party) throw new NotFoundException("Party não encontrada!") 

    this.checkPartyCreator(party, userId)

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

  async removeMemberFromParty(partyId: string, memberId: string, userId: string): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if(!party) throw new NotFoundException("Party não encontrada!") 

    this.checkPartyCreator(party, userId)

    const memberIndex = party.members.findIndex(member => member.userId.equals(memberId))
    if (memberIndex === -1) throw new NotFoundException('Membro não encontrado na party')

    party.members.slice(memberIndex, 1)
    return party.save()
  }

  async removeGoalFromParty(partyId: string, goalId: string, userId: string): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if(!party) throw new NotFoundException("Party não encontrada!") 

    this.checkPartyCreator(party, userId)
    
    const goalIndex = party.goals.findIndex((goal: any) => goal._id.equals(goalId))
    if (goalIndex === -1) throw new NotFoundException('Meta não encontrada')

    party.goals.splice(goalIndex, 1)
    return party.save()
  }

  async deleteParty(partyId: string, userId: string): Promise<void> {
    const party = await this.partyModel.findById(partyId)
    if(!party) throw new NotFoundException("Party não encontrada!") 

    this.checkPartyCreator(party, userId)
    
    await this.partyModel.findByIdAndDelete(partyId)
  }

  async leaveParty(partyId: string, memberId: string): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if(!party) throw new NotFoundException("Party não encontrada!") 

    const memberIndex = party.members.findIndex(member => member.userId.equals(memberId))
    if (memberIndex === -1) throw new NotFoundException('Usuário não encontrado na party')

    party.members.slice(memberIndex, 1)

    return party.save()
  }

  findAll() {
    return this.partyModel.find()
  }
}
