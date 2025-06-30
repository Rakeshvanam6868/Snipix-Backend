"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const user_service_1 = require("../services/user.service");
const logger_1 = __importDefault(require("../utils/logger"));
const mail_service_1 = require("../services/mail.service");
const register_user_1 = require("../utils/mailFormats/register_user");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        try {
            const { email } = req.body;
            user = yield (0, user_service_1.IS_USER_PRESENT)(email);
            if (!user) {
                user = yield (0, user_service_1.CREATE_USER)(req.body);
                yield (0, mail_service_1.emailService)(email, "Welcome to SnipSavvy", { name: user.name }, register_user_1.register_user)
                    .then(() => logger_1.default.info(`Email sent successfully to ${email}`))
                    .catch((error) => logger_1.default.error("Error in sending email:", error));
            }
            const token = yield (0, user_service_1.CREATE_JWT)(user);
            logger_1.default.info(`token get in controller => ${token}`);
            return res.status(200).json({ msg: "Login Successfull", token: token });
        }
        catch (error) {
            return res.status(500).json({ msg: "Internal Server Error", error });
        }
    });
}
