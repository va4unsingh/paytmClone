import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const VerifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request",
        success: false,
      });
    }

    const JWTSEC = process.env.JWT_SECRET;
    if (!JWTSEC) {
      throw new Error("JWT secret not defined");
    }

    const decoded = jwt.verify(token, JWTSEC) as JwtPayload & { id: string };

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("Auth middleware failure:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
