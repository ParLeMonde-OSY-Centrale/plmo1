import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { getRepository } from "typeorm";
import { User } from "../entities/user";
import { Controller, post } from "./controller";
import { logger } from "../utils/logger";
import { generateTemporaryPassword, isPasswordValid } from "../utils/utils";

const secret: string = process.env.APP_SECRET || "";

export class LoginController extends Controller {
  constructor() {
    super("login");
  }

  @post()
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (secret.length === 0) {
      next();
      return;
    }

    const password = req.body.password;
    const username = req.body.username;
    const user = await getRepository(User).findOne({
      where: [{ mail: username }, { pseudo: username }],
    });
    if (user === undefined) {
      throw new Error("Invalid username");
    }
    let isPasswordCorrect: boolean = false;
    try {
      isPasswordCorrect = await argon2.verify(user.passwordHash, password);
    } catch (e) {
      logger.error(JSON.stringify(e));
    }

    if (user.accountRegistration >= 3) {
      throw new Error("Account blocked. Please reset password");
    }

    if (!isPasswordCorrect) {
      user.accountRegistration += 1;
      await getRepository(User).save(user);
      throw new Error("Invalid password");
    } else {
      user.accountRegistration = 0;
      await getRepository(User).save(user);
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
    res.sendJSON({ user: user.userWithoutPassword(), token: token }); // send new user
  }

  @post({ path: "/reset-password" })
  public async resetPassword(req: Request, res: Response): Promise<void> {
    const mail = req.body.email;
    const user = await getRepository(User).findOne({
      where: { mail },
    });
    if (user === undefined) {
      throw new Error("Invalid email");
    }

    const temporaryPassword = generateTemporaryPassword(12);
    logger.info(temporaryPassword); // TODO: remove
    user.verificationHash = await argon2.hash(temporaryPassword);
    user.accountRegistration = 3;
    await getRepository(User).save(user);

    // TODO: send mail with verification password
    res.sendJSON({ success: true });
  }

  @post({ path: "/update-password" })
  public async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (secret.length === 0) {
      next();
      return;
    }
    // get user
    const mail = req.body.email;
    const user = await getRepository(User).findOne({
      where: { mail },
    });
    if (user === undefined) {
      throw new Error("Invalid email");
    }

    // verify token
    const verifyToken = req.body.verifyToken || "";
    let isverifyTokenCorrect: boolean = false;
    try {
      isverifyTokenCorrect = await argon2.verify(user.verificationHash, verifyToken);
    } catch (e) {
      logger.error(JSON.stringify(e));
    }
    if (!isverifyTokenCorrect) {
      throw new Error("Invalid reset token");
    }

    // update password
    const password = req.body.password;
    if (!isPasswordValid(password)) {
      throw new Error("Invalid password");
    }
    user.passwordHash = await argon2.hash(password);
    user.accountRegistration = 0;
    user.verificationHash = "";
    await getRepository(User).save(user);

    // login user
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
    res.sendJSON({ user: user.userWithoutPassword(), token: token }); // send new user
  }
}