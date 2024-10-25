import { HttpException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'
import { Model } from 'mongoose'
import { User } from 'src/schemas/User.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec()
      if (existingUser) {
        throw new HttpException('Email já está em uso.', 400)
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt)

      const newUser = new this.userModel({ ...createUserDto, password: hashedPassword })

      return await newUser.save()
    } catch (error) {
      console.log(error)
      throw new HttpException('Erro ao criar usuário.', 500)
    }
  }

  findAll() {
    return this.userModel.find()
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email })

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return user
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec()

    if (!user) {
      new HttpException('Usuário não encontrado.', 404)
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec()

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({ email: updateUserDto.email }).exec()
      if (existingUser) {
        throw new HttpException('Email já está em uso.', 400)
      }
    }

    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true })
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new HttpException('Usuário não encontrado.', 404)
    }

    return this.userModel.findByIdAndDelete(id)
  }
}
