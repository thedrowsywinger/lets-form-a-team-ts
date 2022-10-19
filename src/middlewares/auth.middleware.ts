import { NextFunction, Response } from "express";
import jwt = require("jsonwebtoken");
// import { SECRET_KEY } from "@config";
import DB from "@models/index";
import { HttpException } from "@exceptions/HttpException";
// import { DataStoredInToken, RequestWithUser } from "@interfaces/auth.interface";
import { RequestWithUser } from "@interfaces/auth.interface";

import { EHttpStatusCodes } from "@/common";

import { ApiResponseMessages } from "@/utils/apiResponseMessages";

const JWT_SECRET_KEY = String(process.env.JWT_SECRET_KEY);
const JWT_REFRESH_TOKEN_SECRET_KEY = String(process.env.JWT_REFRESH_TOKEN_KEY);

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.header || !req.header("Authorization")) {
      return res
        .status(EHttpStatusCodes.UNAUTHORIZED)
        .send({ message: ApiResponseMessages.INVALID_JWT });
    }

    const token = req.header("Authorization")?.replace("jwt ", "");
    if (!token) {
      return res.status(EHttpStatusCodes.UNAUTHORIZED).send({
        message: ApiResponseMessages.INVALID_JWT,
      });
    }

    let decoded;
    decoded = jwt.verify(token, JWT_SECRET_KEY);

    if (!decoded) {
      decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET_KEY);
    }

    if (!decoded) {
      return res.status(EHttpStatusCodes.UNAUTHORIZED).send({
        message: ApiResponseMessages.INVALID_JWT,
      });
    }

    req["decoded"] = decoded;

    const userInstance = await DB.Users.findOne({
      where: { id: parseInt(decoded["_id"]) },
    });

    if (!userInstance) {
      return res.status(EHttpStatusCodes.BAD_REQUEST).send({
        message: ApiResponseMessages.INVALID_USER,
      });
    }

    req["userId"] = parseInt(decoded["_id"]);

    const userTypeMapInstance = await DB.UserTypeMap.findOne({
      where: { userId: parseInt(decoded["_id"]) },
    });

    if (!userTypeMapInstance) {
      res.status(EHttpStatusCodes.BAD_REQUEST).send({
        message: ApiResponseMessages.NO_USER_TYPE_MAP,
      });
    }

    const userTypeInstance = await DB.UserTypes.findOne({
      where: { id: userTypeMapInstance.userTypeId },
    });

    if (!userTypeInstance) {
      return res.status(EHttpStatusCodes.UNAUTHORIZED).send({
        message: ApiResponseMessages.INVALID_USER_TYPE,
      });
    }

    req["userType"] = userTypeInstance.userTypeId;
    next();
    // const userInstance = await DB.Users.findOne({where:{}})

    // const Authorization =
    //   req.cookies["Authorization"] ||
    //   (req.header("Authorization")
    //     ? req.header("Authorization").split("Bearer ")[1]
    //     : null);
    // if (Authorization) {
    //   const secretKey: string = SECRET_KEY;
    //   const verificationResponse = verify(
    //     Authorization,
    //     secretKey,
    //   ) as DataStoredInToken;
    //   const userId = verificationResponse.id;
    //   const findUser = await DB.Users.findByPk(userId);
    //   if (findUser) {
    //     req.user = findUser;
    //     next();
    //   } else {
    //     next(
    //       new HttpException(
    //         EHttpStatusCodes.UNAUTHORIZED,
    //         "Wrong authentication token",
    //       ),
    //     );
    //   }
    // } else {
    //   next(
    //     new HttpException(
    //       EHttpStatusCodes.BAD_REQUEST,
    //       "Authentication token missing",
    //     ),
    //   );
    // }
  } catch (error) {
    next(
      new HttpException(
        EHttpStatusCodes.UNAUTHORIZED,
        ApiResponseMessages.INVALID_JWT,
      ),
    );
  }
};

export default authMiddleware;
