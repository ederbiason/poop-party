import { Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"

class GoalDto {
    @IsNotEmpty()
    targetShits: number;

    @IsOptional()
    completed?: boolean = false;
}

class MemberDto {
    @IsString()
    userId: string;

    @IsOptional()
    individualShits?: number = 0
}

export class CreatePartyDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDto)
    @IsOptional()
    members?: MemberDto[];

    @IsOptional()
    @IsDateString()
    endDate?: Date

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GoalDto)
    goals: GoalDto[]
}
