"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workspace_controller_1 = require("../controllers/workspace.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const express_1 = __importDefault(require("express"));
const workspace = express_1.default.Router();
workspace.post("/", authMiddleware, workspace_controller_1.createWorkspace);
workspace.get("/", authMiddleware, workspace_controller_1.fetchWorkspaces);
workspace.delete("/", authMiddleware, workspace_controller_1.Delete_Workspace);
workspace.get("/access/:w_id", authMiddleware, workspace_controller_1.get_workspace_access);
workspace.delete("/access", authMiddleware, workspace_controller_1.Remove_Workspace_Access);
workspace.put("/", authMiddleware, workspace_controller_1.editWorkspace);
workspace.delete("/shared", authMiddleware, workspace_controller_1.remove_shared_workspaces);
module.exports = workspace;
