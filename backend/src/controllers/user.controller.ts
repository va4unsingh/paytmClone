import { Request, Response } from "express";
import { signUpBody } from "../schema/signUp.schema";
import { UserModel } from "../models/user.model";
import jwt from "jsonwebtoken";
import { signInBody } from "../schema/signIn.schema";
import bcrypt from "bcryptjs";

const signUp = async (req: Request, res: Response) => {
  try {
    const parsedBody = signUpBody.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }
    const { username, password, firstName, lastName } = parsedBody.data;

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const user = await UserModel.create({
      username: username.toLowerCase(),
      password,
      firstName,
      lastName,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

    res.status(200).json({
      message: "User registered succesfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("SignUp error", error);
    res.status(500).json({
      message: "Internal server error while registering user",
      success: false,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const parsedBody = signInBody.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const { username, password } = parsedBody.data;
    const existingUser = await UserModel.findOne({ username });

    if (!existingUser) {
      return res.status(400).json({
        message: "Username doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    const JWTSECRET = process.env.JWT_SECRET;
    if (!JWTSECRET) {
      throw new Error("JWT secret not defined");
    }

    const token = jwt.sign({ id: existingUser._id }, JWTSECRET, {
      expiresIn: "24h",
    });
    
  } catch (error) {}
};
export { signUp };
