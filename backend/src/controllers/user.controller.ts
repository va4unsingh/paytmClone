import { Request, Response } from "express";
import { signUpBody } from "../schema/signUp.schema";
import { UserModel } from "../models/user.model";
import jwt from "jsonwebtoken";

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
        const parsedBody = 
    } catch (error) {
        
    }
};
export { signUp };
