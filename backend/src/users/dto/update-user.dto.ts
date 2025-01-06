import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IsEmail, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator'
import { Expose } from 'class-transformer'

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsEmail({}, { message: 'Email inválido, tente novamente.' })
    @Expose()
    email: string

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password: string

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    newPassword: string

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'O número de vitórias deve ser 0 ou maior.' })
    @Expose()
    partyWins: number

    @IsOptional()
    @IsString()
    @Expose()
    profileImage: string
}
