import { IsEmail, IsString, MinLength, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator'
import { Expose, Transform } from 'class-transformer'

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
