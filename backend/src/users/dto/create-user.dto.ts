import { IsEmail, IsString, MinLength, IsNotEmpty, IsArray, IsNumber, IsOptional } from 'class-validator'
import { Expose, Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email inválido, tente novamente.' })
    @Expose()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password: string

    // Extract the name from the first part of user email if there is no name seted by the user
    @Transform(({ value, obj }) => value || obj.email.split('@')[0]) 
    @IsString()
    @Expose()
    name: string
}
