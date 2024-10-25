import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)

    if (!user) {
        throw new Error("O usuário não existe.")
    }

    const passwordMatch = await bcrypt.compare(pass, user.password)
    if (!passwordMatch) {
        throw new Error("O email ou senha estão inválidos.")
    }

    if (user && passwordMatch) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
