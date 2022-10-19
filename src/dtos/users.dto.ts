import { IsString, IsEmail, IsNumber } from "class-validator";

export class CreateUserDto {
  @IsString()
  public username: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public name: string;

  @IsString()
  public contactNumber: string;

  @IsNumber()
  public userTypeId: number;
}
