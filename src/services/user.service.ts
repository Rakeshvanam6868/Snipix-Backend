import UserMeta from "../models/user.meta.model";
import User, { IUser } from "../models/user.model";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";

// Check if a user exists
export async function IS_USER_PRESENT(email: string) {
  try {
    const user = await User.findOne({ email: email });
    return user || null;
  } catch (error) {
    logger.error("Error checking for user presence:", error);
    throw error;
  }
}

// Create user meta and user
export async function CREATE_USER(body: any) {
  try {
    const { email } = body;
    const userMeta = await UserMeta.create({ email });
    body.user_meta_id = userMeta._id;
    const user = await User.create(body);
    return user;
  } catch (error) {
    // Handle duplicate key error (e.g., duplicate email)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === 11000
    ) {
      logger.warn("Duplicate email on user creation:", (error as any).keyValue);
      throw new Error("Email already registered");
    }
    logger.error("Error creating user:", error);
    throw error;
  }
}

// Create JWT token with expiry (1 hour)
export async function CREATE_JWT(user: IUser) {
  try {
    const { _id, name, email } = user;
    const payload = { user_id: _id, name: name, email: email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    logger.info(`Generated token => ${token}`);
    return token;
  } catch (error) {
    logger.error("Error generating JWT:", error);
    throw error;
  }
}

// (Optional, for refresh token logic)
export function CREATE_REFRESH_TOKEN(user: IUser) {
  const { _id, email } = user;
  return jwt.sign(
    { user_id: _id, email, type: "refresh" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
