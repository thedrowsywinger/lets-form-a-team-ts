import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "@config";
import DB from "@models/index";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, TokenData } from "@interfaces/auth.interface";
import { IUser } from "@interfaces/users.interface";
import { isEmpty } from "@utils/util";
import { EHttpStatusCodes } from "@/common";
import { ApiResponseMessages } from "@utils/apiResponseMessages";
import { EUserTypes } from "@/utils/constants";
class AuthService {
  public users = DB.Users;
  public userTypes = DB.UserTypes;

  public async signup(userData: CreateUserDto): Promise<IUser> {
    if (isEmpty(userData))
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.INVALID_POST_REQUEST,
      );

    const transaction = await DB.sequelize.transaction();
    try {
      const userTypeInstance = await this.userTypes.findOne({
        where: { userTypeId: userData.userTypeId },
      });
      if (!userTypeInstance) {
        throw new HttpException(
          EHttpStatusCodes.BAD_REQUEST,
          ApiResponseMessages.INVALID_USER_TYPE,
        );
      }

      if (userTypeInstance.userTypeId === EUserTypes.MANAGER) {
        if (req.userType === EUserTypes.SUPER_ADMIN) {
          const findUserByEmail: IUser = await this.users.findOne({
            where: { email: userData.email },
          });
          if (findUserByEmail)
            throw new HttpException(
              EHttpStatusCodes.CONFLICT,
              ApiResponseMessages.EMAIL_ALREADY_EXISTS(userData.email),
            );

          const hashedPassword = await hash(userData.password, 10);
          const createUserData: IUser = await this.users.create({
            ...userData,
            password: hashedPassword,
          });

          return createUserData;
        }
      }
    } catch (e) {
      await transaction.rollback();
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.SYSTEM_ERROR,
      );
    }
  }

  public async login(
    userData: CreateUserDto,
  ): Promise<{ cookie: string; findUser: IUser }> {
    if (isEmpty(userData))
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        "You're not userData",
      );

    const findUser: IUser = await this.users.findOne({
      where: { email: userData.email },
    });
    if (!findUser)
      throw new HttpException(
        EHttpStatusCodes.CONFLICT,
        `Your email ${userData.email} not found`,
      );

    const isPasswordMatching: boolean = await compare(
      userData.password,
      findUser.password,
    );
    if (!isPasswordMatching)
      throw new HttpException(
        EHttpStatusCodes.CONFLICT,
        "Your password not matching",
      );

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: IUser): Promise<IUser> {
    if (isEmpty(userData))
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        "You're not userData",
      );

    const findUser: IUser = await this.users.findOne({
      where: { email: userData.email, password: userData.password },
    });
    if (!findUser)
      throw new HttpException(EHttpStatusCodes.CONFLICT, "You're not user");

    return findUser;
  }

  public createToken(user: IUser): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return {
      expiresIn,
      token: sign(dataStoredInToken, secretKey, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
