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
exports.IS_USER_PRESENT = IS_USER_PRESENT;
exports.CREATE_USER = CREATE_USER;
exports.CREATE_JWT = CREATE_JWT;
const jwt_1 = require("../config/jwt");
const user_meta_model_1 = __importDefault(require("../models/user.meta.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function IS_USER_PRESENT(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findOne({ email: email });
            if (user) {
                return user;
            }
            return null;
        }
        catch (error) {
            logger_1.default.error("caught error in user service while checking for user presence");
            throw error;
        }
    });
}
function CREATE_USER(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = body;
            console.log("service body =>", body);
            const user = yield user_meta_model_1.default.create({ email });
            body.user_meta_id = user._id;
            const user_data = yield user_model_1.default.create(body);
            return user_data;
        }
        catch (error) {
            logger_1.default.error("caught error in user service while creating user");
            throw error;
        }
    });
}
function CREATE_JWT(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { _id, name, email } = user;
            const payload = {
                user_id: _id,
                name: name,
                email: email,
            };
            const token = jsonwebtoken_1.default.sign(payload, jwt_1.JWT_SECRET);
            logger_1.default.info(`Generated token => ${token}`);
            return token;
        }
        catch (error) {
            logger_1.default.error("caught error in user service while generating JWT");
            throw error;
        }
    });
}
