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

    for (const member of members) {
      const user = await this.usersService.findOne(member.userId)
      if (!user) throw new NotFoundException(`Usuário com ID ${member.userId} não encontrado!`)

      if (!user.parties.includes(newParty._id as Types.ObjectId)) {
        user.parties.push(newParty._id as Types.ObjectId)
        await user.save()
      }
    }

    return newParty.save().then(party => party.populate('members.userId', 'name email'))
  }

  async addMemberToParty(partyId: string, userId: string, email: string): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if (!party) throw new NotFoundException("Party não encontrada!")

    this.checkPartyCreator(party, userId)

    const user = await this.usersService.findByEmail(email)
    if (!user) throw new NotFoundException("Usuário não encontrado!")

    const isMember = party.members.some(member => member.userId.equals(user._id))
    if (isMember) throw new BadRequestException("Usuário já existe na party")

    user.parties.push(new Types.ObjectId(partyId))
    user.save()

    party.members.push({ userId: new Types.ObjectId(user._id), individualShits: 0 })

    return party.save().then(updatedParty => updatedParty.populate('members.userId', 'name email'))
  }

  async addGoalToParty(partyId: string, userId: string, targetShits: number): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if (!party) throw new NotFoundException("Party não encontrada!")

    this.checkPartyCreator(party, userId)

    if (1 > targetShits) throw new BadRequestException("O número alvo de cagadas deve ser maior que 1.")

    const targetAlreadyExist = party.goals.some(goal => goal.targetShits === targetShits)
    if (targetAlreadyExist) throw new BadRequestException("Essa meta já existe na party.")

    party.goals.push({ _id: new Types.ObjectId(), targetShits, completed: false })

    return party.save()
  }

  async editGoal(partyId: string, userId: string, goalId: string, newTargetShits?: number, completed?: boolean): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if (!party) throw new NotFoundException("Party não encontrada!")

    this.checkPartyCreator(party, userId)

    const goal = party.goals.find(goal => goal._id.equals(goalId))
    if (!goal) throw new NotFoundException('Meta não encontrada na party')

    if (newTargetShits !== undefined) {
      const goalExist = party.goals.find(goal => goal.targetShits === newTargetShits)
      if (goalExist) throw new BadRequestException("O novo valor da meta já existe")

      goal.targetShits = newTargetShits > 0 ? newTargetShits : 1
    }

    if (completed !== undefined) {
      goal.completed = completed
    }

    await party.save()

    return party
  }

  async updateIndividualShits(partyId: string, userId: string, amount: number): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if (!party) throw new NotFoundException("Party não encontrada!")

    const member = party.members.find(member => member.userId.equals(userId))
    if (!member) throw new NotFoundException('Membro não encontrado na party')

    member.individualShits += amount
    if (member.individualShits < 0) member.individualShits = 0

    party.history.push({
      userId: new Types.ObjectId(userId),
      shitTime: new Date()
    })

    await party.save()

    return party.populate('history.userId', 'name profileImage')
  }

  async editMember(partyId: string, userId: string, memberId: string, amount: number): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if (!party) throw new NotFoundException("Party não encontrada!")

    this.checkPartyCreator(party, userId)

    const member = party.members.find(member => member.userId.equals(memberId))
    if (!member) throw new NotFoundException('Membro não encontrado na party')

    member.individualShits = amount
    if (member.individualShits < 0) member.individualShits = 0

    await party.save()

    return party
  }

  async removeMemberFromParty(partyId: string, memberId: string, userId: string): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if (!party) throw new NotFoundException("Party não encontrada!")

    if (memberId === userId) throw new BadRequestException("O criador da party não pode remover a si mesmo.")

    this.checkPartyCreator(party, userId)

    const memberIndex = party.members.findIndex(member => member.userId.equals(memberId))
    if (memberIndex === -1) throw new NotFoundException('Membro não encontrado na party')

    party.members.splice(memberIndex, 1)
    await party.save()

    const user = await this.usersService.findOne(memberId)
    if (user) {
      user.parties = user.parties.filter(party => !party.equals(partyId))
      await user.save()
    }

    return party
  }

  async removeGoalFromParty(partyId: string, goalId: string, userId: string): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if (!party) throw new NotFoundException("Party não encontrada!")

    this.checkPartyCreator(party, userId)

    const goalIndex = party.goals.findIndex((goal: any) => goal._id.equals(goalId))
    if (goalIndex === -1) throw new NotFoundException('Meta não encontrada')

    party.goals.splice(goalIndex, 1)
    return party.save()
  }

  async deleteParty(partyId: string, userId: string): Promise<void> {
    const party = await this.partyModel.findById(partyId)
    if (!party) throw new NotFoundException("Party não encontrada!")

    this.checkPartyCreator(party, userId)

    for (const member of party.members) {
      const user = await this.usersService.findOne(member.userId.toString())
      if (user) {
        user.parties = user.parties.filter((userPartyId) => !new Types.ObjectId(userPartyId).equals(partyId))
        await user.save()
      }
    }

    await this.partyModel.findByIdAndDelete(partyId)
  }

  async leaveParty(partyId: string, memberId: string): Promise<Party> {
    const party = await this.partyModel.findById(partyId)
    if (!party) throw new NotFoundException("Party não encontrada!")

    if (memberId === String(party.createdBy)) throw new BadRequestException("O criador da party não pode sair, apenas deletar a party.")

    const memberIndex = party.members.findIndex(member => new Types.ObjectId(member.userId).equals(new Types.ObjectId(memberId)))
    if (memberIndex === -1) throw new NotFoundException('Usuário não encontrado na party')

    party.members.splice(memberIndex, 1)
    party.save()

    const user = await this.usersService.findOne(memberId)
    if (user) {
      user.parties = user.parties.filter((userPartyId) => !new Types.ObjectId(userPartyId).equals(partyId))
      await user.save()
    }

    return party
  }

  findAll() {
    return this.partyModel.find()
  }

  async findPartyById(partyId: string): Promise<Party> {
    const party = await this.partyModel
      .findById(partyId)
      .populate('history.userId', 'name email profileImage')
      .populate('members.userId', 'name email profileImage')

    if (!party) throw new NotFoundException('Party não encontrada!')

    return party
  }

  async findPartiesByUser(userId: string): Promise<Party[]> {
    const parties = await this.partyModel
      .find({ "members.userId": userId })
      .populate("members.userId", "name email profileImage partyWins")
      .populate("createdBy", "name email")

    if (!parties || parties.length === 0) {
      throw new NotFoundException("Nenhuma party encontrada para este usuário.")
    }

    return parties
  }

  async updatePartyStatus(partyId: string, userWinnerId: string): Promise<Party> {
    const updatedParty = await this.partyModel.findByIdAndUpdate(
      partyId,
      { partyEnded: true },
      { new: true }
    )
    if (!updatedParty) throw new NotFoundException('Party não encontrada!')

    const updatedUser = await this.usersService.findOne(userWinnerId)
    if (!updatedUser) throw new NotFoundException('Usuário não encontrado!')

    updatedUser.partyWins += 1
    updatedUser.save()

    return updatedParty
  }

  async updatePartyName(partyId: string, newPartyName: string, userId: string): Promise<Party> {
    if(newPartyName.trim() === "") throw new BadRequestException("O nome da party não pode ser vazio!")

    const party = await this.partyModel.findById(partyId)
    if (!party) throw new NotFoundException("Party não encontrada!")

    this.checkPartyCreator(party, userId)

    const updatedParty = await this.partyModel.findByIdAndUpdate(
      partyId,
      { name: newPartyName },
      { new: true }
    )

    return updatedParty
  }
}
