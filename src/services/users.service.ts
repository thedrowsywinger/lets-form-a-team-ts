import { hash } from "bcrypt";
import DB from "@models/index";
import { UpdateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { IUser } from "@interfaces/users.interface";
import { isEmpty } from "@utils/util";
import { EHttpStatusCodes } from "@/common";
import { IProfile } from "@/interfaces/profile.interface";
import { ApiResponseMessages } from "@/utils/apiResponseMessages";

class UserService {
  public users = DB.Users;
  public profile = DB.Profile;

  public async getAllUsers(): Promise<IProfile[]> {
    const users: IProfile[] = await this.profile.findAll();
    return users;
  }

  public async getUserById(userId: number): Promise<IProfile> {
    if (isEmpty(userId)) {
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.INVALID_POST_REQUEST,
      );
    }

    const user: IProfile = await this.profile.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.INVALID_USER,
      );
    }

    return user;
  }

  public async deleteUser(userId: number): Promise<{ result: boolean }> {
    if (isEmpty(userId)) {
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.INVALID_POST_REQUEST,
      );
    }

    const user: IProfile = await this.profile.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.INVALID_USER,
      );
    }

    try {
      await this.profile.destroy({ where: { id: userId } });

      return { result: true };
    } catch {
      throw new HttpException(
        EHttpStatusCodes.BAD_GATEWAY,
        ApiResponseMessages.SYSTEM_ERROR,
      );
    }
  }

  public async editUser(
    userId: number,
    userData: UpdateUserDto,
  ): Promise<IProfile> {
    if (isEmpty(userId)) {
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.INVALID_POST_REQUEST,
      );
    }

    const user: IProfile = await this.profile.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.INVALID_USER,
      );
    }

    try {
      await this.profile.update(userData, { where: { id: userId } });
      const updatedUserData: IProfile = await this.profile.findOne({
        where: { id: userId },
      });
      return updatedUserData;
    } catch {
      throw new HttpException(
        EHttpStatusCodes.BAD_GATEWAY,
        ApiResponseMessages.SYSTEM_ERROR,
      );
    }
  }
}

export default UserService;
