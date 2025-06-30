"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware = require("../middlewares/auth.middleware");
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const user = express_1.default.Router();
user.post("/", user_controller_1.register);
module.exports = user;
