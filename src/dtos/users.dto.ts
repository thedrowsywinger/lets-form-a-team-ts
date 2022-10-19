import { IsString, IsEmail, IsNumber } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsNumber()
  public userTypeId: number;

  @IsString()
  public name: string;

  @IsString()
  public contactNumber: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
