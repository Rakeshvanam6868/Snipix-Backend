"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const categoryRouter = express_1.default.Router();
const authMiddleware = require("../middlewares/auth.middleware");
categoryRouter.post("/", authMiddleware, category_controller_1.createCategory);
categoryRouter.get("/:workspace_id", authMiddleware, category_controller_1.fetchCategoriesByWorkspace);
categoryRouter.put("/:workspace_id/:category_id", authMiddleware, category_controller_1.updateCategory);
categoryRouter.delete("/", authMiddleware, category_controller_1.deleteCategories);
module.exports = categoryRouter;
