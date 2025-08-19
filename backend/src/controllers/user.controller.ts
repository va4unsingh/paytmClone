import { Request, Response } from "express";
import { signUpBody } from "../schema/signUp.schema";
import { UserModel } from "../models/user.model";
import jwt from "jsonwebtoken";
import { signInBody } from "../schema/signIn.schema";
import bcrypt from "bcryptjs";
import { updateBody } from "../schema/updateBody.schema";
import { AccountModel } from "../models/account.models";
import mongoose from "mongoose";

const signUp = async (req: Request, res: Response) => {
  try {
    const parsedBody = signUpBody.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
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

    const userId = user._id;

    // Create New account

    await AccountModel.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    const createdUser = await UserModel.findById(user._id).select("-password");

    if (!createdUser) {
      return res.status(400).json({
        message: "Something went wrong while registering the userd",
      });
    }

    res.status(200).json({
      message: "User registered succesfully",
      createdUser,
      success: true,
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
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
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

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.status(200).cookie("token", token, cookieOptions).json({
      message: "User Signed In succesfully",
      success: true,
      token,
    });
  } catch (error) {
    console.error("SignUp error", error);
    res.status(500).json({
      message: "Internal server error while signing up user",
      success: false,
    });
  }
};

const updateUserInformation = async (req: Request, res: Response) => {
  try {
    const parsedBody = updateBody.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const existingUser = await UserModel.findById(req.userId);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const { password, firstName, lastName } = parsedBody.data;
    await UserModel.updateOne({ _id: req.userId }, parsedBody.data);

    const updatedUser = await UserModel.findById(req.userId).select(
      "-password"
    );

    res.status(200).json({
      message: "Updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user information error", error);
    res.status(500).json({
      message: "Internal server error while updating user information",
      success: false,
    });
  }
};

const bulk = async (req: Request, res: Response) => {
  try {
    const filter = (req.query.filter as string) || "";
    if (!filter.trim()) {
      return res.status(400).json({
        message: "Filter parameter is required",
        success: false,
      });
    }

    const users = await UserModel.find({
      $or: [
        {
          firstName: {
            $regex: filter,
            $options: "i", // Case-insensitive
          },
        },
        {
          lastName: {
            $regex: filter,
            $options: "i", // Case-insensitive
          },
        },
      ],
    })
      .limit(50)
      .sort({ firstName: 1, lastName: 1 });

    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      count: users.length,
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    console.error("Get bulk users error", error);
    res.status(500).json({
      message: "Internal server error while getting user information",
      success: false,
    });
  }
};

const accountBalance = async (req: Request, res: Response) => {
  try {
    const account = await AccountModel.findOne({
      userId: req.userId,
    });

    res.status(200).json({
      balance: account?.balance,
    });
  } catch (error) {
    console.error("Error while getting account balance", error);
    res.status(500).json({
      message: "Internal server error while getting user account balance",
      success: false,
    });
  }
};

const transferMoneyToAnotherAccount = async (req: Request, res: Response) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await AccountModel.findOne({ userId: req.userId }).session(
      session
    );

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await AccountModel.findOne({
      userId: to,
    }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      res.status(200).json({
        message: "Invalid account",
      });
    }

    // Perform the transfer
    await AccountModel.updateOne(
      { userId: req.userId },
      {
        $inc: {
          balance: -amount,
        },
      }
    ).session(session);

    await AccountModel.updateOne(
      {
        userId: to,
      },
      {
        $inc: {
          balance: amount,
        },
      }
    );

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json({
      message: "Transfer successful",
    });
  } catch (error) {
    console.error(
      "Error while getting transferring money to another person",
      error
    );
    res.status(500).json({
      message: "Internal server error while money transfer",
      success: false,
    });
  }
};

export {
  signUp,
  signIn,
  updateUserInformation,
  bulk,
  accountBalance,
  transferMoneyToAnotherAccount,
};
