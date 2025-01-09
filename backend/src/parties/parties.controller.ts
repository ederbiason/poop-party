import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PartiesService } from './parties.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('parties')
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createParty(@Body() createPartyDto: CreatePartyDto, @Request() req) {
    const createdBy = req.user._id

    return this.partiesService.create(createPartyDto, createdBy)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/members')
  addMemberToParty(
    @Param('id') partyId: string,
    @Body('email') email: string,
    @Request() req
  ) {
    const userId = req.user._id

    return this.partiesService.addMemberToParty(partyId, userId, email)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/goals')
  addGoalToParty(
    @Param('id') partyId: string,
    @Body('targetShits') targetShits: number,
    @Request() req
  ) {
    const userId = req.user._id

    return this.partiesService.addGoalToParty(partyId, userId, targetShits)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/goal/edit')
  editGoal(
    @Param('id') partyId: string,
    @Body('goalId') goalId: string,
    @Request() req,
    @Body('newTargetShits') newTargetShits?: number,
    @Body('completed') completed?: boolean
  ) {
    const userId = req.user._id

    return this.partiesService.editGoal(partyId, userId, goalId, newTargetShits, completed)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/shits')
  updateIndividualShits(
    @Param('id') partyId: string,
    @Body('amount') amount: number,
    @Request() req
  ) {
    const userId = req.user._id

    return this.partiesService.updateIndividualShits(partyId, userId, amount)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/member/edit')
  editMember(
    @Param('id') partyId: string,
    @Body('amount') amount: number,
    @Body('memberId') memberId: string,
    @Request() req
  ) {
    const userId = req.user._id

    return this.partiesService.editMember(partyId, userId, memberId, amount)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/members/:memberId')
  removeMemberFromParty(
    @Param('id') partyId: string,
    @Param('memberId') memberId: string,
    @Request() req
  ) {
    const userId = req.user._id

    return this.partiesService.removeMemberFromParty(partyId, memberId, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/goals/:goalId')
  removeGoalFromParty(
    @Param('id') partyId: string,
    @Param('goalId') goalId: string,
    @Request() req
  ) {
    const userId = req.user._id

    return this.partiesService.removeGoalFromParty(partyId, goalId, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteParty(@Param('id') partyId: string, @Request() req) {
    const userId = req.user._id

    await this.partiesService.deleteParty(partyId, userId)
    return { message: 'Party deletada com sucesso' }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/leave')
  async leaveParty(@Param('id') partyId: string, @Request() req) {
    const userId = req.user._id

    const updatedParty = await this.partiesService.leaveParty(partyId, userId)

    return updatedParty
  }

  @Get()
  findAll() {
    return this.partiesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findPartyById(@Param('id') partyId: string) {
    const party = await this.partiesService.findPartyById(partyId)

    return party
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:userId')
  async getPartiesByUser(@Param('userId') userId: string) {
    return await this.partiesService.findPartiesByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updatePartyStatus(@Param('id') partyId: string, @Body('userWinnerId') userWinnerId: string) {
    return await this.partiesService.updatePartyStatus(partyId, userWinnerId)
  }
}
