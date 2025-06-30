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
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../config/jwt");
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(403).json({
            msg: "Invalid header",
        });
    }
    const token = header.split(" ")[1];
    try {
        const payload = jwt.verify(token, jwt_1.JWT_SECRET);
        console.log(payload);
        const user = yield user_model_1.default.findOne({ _id: payload.user_id });
        if (!user) {
            return res.status(403).json({
                msg: "Invalid Request! user not found in the token",
            });
        }
        req.user_id = payload.user_id;
        next();
    }
    catch (err) {
        return res.status(403).json({
            msg: "Invalid token",
        });
    }
});
module.exports = authMiddleware;
