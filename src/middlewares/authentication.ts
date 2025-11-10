import { Request, Response, NextFunction } from "express";
import User from "../models/user/userModel";
import Token from "../models/user/userModel";


export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Authorization header'ı oku
    const authHeader = req.headers.authorization || null; // "Token ...tokenKey..."
    const tokenParts = authHeader ? authHeader.split(" ") : null; // ['Token', 'tokenKey']

    if (tokenParts && tokenParts[0] === "Barer") {
      const tokenKey = tokenParts[1];
      const tokenData = await Token.findOne({ token: tokenKey });

      if (tokenData) {
        const user = await User.findById(tokenData.userId);
        req.user = user ? user.toObject() : null; // kullanıcıyı req'e ekle
      }
    }

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    next(err);
  }
};
