import { Request, Response } from "express";
import {
  CREATE_JWT,
  CREATE_REFRESH_TOKEN,
  CREATE_USER,
  IS_USER_PRESENT
} from "../services/user.service";
import logger from "../utils/logger";
import { emailService } from "../services/mail.service";
import { register_user } from "../utils/mailFormats/register_user";



export async function register(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email is required." });
    }

    let user = await IS_USER_PRESENT(email);
    if (!user) {
      user = await CREATE_USER(req.body);

      // Send welcome email
      try {
        await emailService(
          email, "Welcome to Snipix", { name: user.name }, register_user
        );
        logger.info(`Email sent successfully to ${email}`);
      } catch (err) {
        logger.error("Error sending email:", err);
      }
    }

    // Issue JWT and (optionally) refresh token
    const token = await CREATE_JWT(user);
    const refreshToken = CREATE_REFRESH_TOKEN(user);

    logger.info(`Token issued in controller`);

    res.status(200).json({ 
      msg: "Login Successful", 
      token, 
      refreshToken // send for storage in httpOnly cookie on client 
    });
  } catch (error: any) {
    logger.error("Registration error:", error);
    let message = "Internal Server Error";
    if (error.message === "Email already registered") {
      message = error.message;
    }
    res.status(500).json({ msg: message });
  }
}
