"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shared_controller_1 = require("../controllers/shared.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const ShareRouter = express_1.default.Router();
ShareRouter.post("/category", authMiddleware, shared_controller_1.Share_category);
ShareRouter.post("/workspace", authMiddleware, shared_controller_1.Share_workspace);
module.exports = ShareRouter;
