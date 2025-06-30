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
exports.createWorkspace = createWorkspace;
exports.fetchWorkspaces = fetchWorkspaces;
exports.Delete_Workspace = Delete_Workspace;
exports.get_workspace_access = get_workspace_access;
exports.Remove_Workspace_Access = Remove_Workspace_Access;
exports.editWorkspace = editWorkspace;
exports.remove_shared_workspaces = remove_shared_workspaces;
const workspace_service_1 = require("../services/workspace.service");
const logger_1 = __importDefault(require("../utils/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
function createWorkspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`REQ : Create a workspace for user ${req.user_id}`);
            let body = req.body;
            body.owner = req.user_id;
            const data = yield (0, workspace_service_1.CREATE_WORKSPACE)(body);
            logger_1.default.info(`RESP : Workspace created => ${data}`);
            return res.status(201).json({
                message: "Workspace created successfully",
                data,
            });
        }
        catch (error) {
            logger_1.default.error(`Error in creating a workspace => ${error}`);
            return res.status(500).json({
                message: "Error in creating a workspace",
                error,
            });
        }
    });
}
function fetchWorkspaces(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.user_id;
            let data;
            const { email } = req.query;
            if (id && typeof id == "string" && !email) {
                const objectId = new mongoose_1.default.Types.ObjectId(id);
                logger_1.default.info(`REQ : Fetch all workspaces for a particular user => ${objectId}`);
                data = yield (0, workspace_service_1.FETCH_ALL_WORKSPACES)(objectId);
            }
            else {
                if (email && typeof email == "string") {
                    // now fetch all the shared workspaces on this email
                    data = yield (0, workspace_service_1.FETCH_SHARED_WORKSPACES)(email);
                }
            }
            logger_1.default.info(`RESP : Workspaces fetched => ${data}`);
            return res.status(200).json(data);
        }
        catch (error) {
            logger_1.default.error(`Error in fetching workspaces => ${error}`);
            return res.status(500).json({
                message: "Error in fetching a workspaces",
                error,
            });
        }
    });
}
function Delete_Workspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const w_id = req.query.w_id;
            logger_1.default.info(`REQ : Delete a workspace => ${w_id}`);
            if (!w_id) {
                logger_1.default.error("workspace id is required while deleting a workspace");
                return res.status(500).json({ mesg: "Workspace id is required" });
            }
            const user_id = req.user_id;
            let data;
            if (typeof w_id == "string" && typeof user_id == "string") {
                data = yield (0, workspace_service_1.DELETE_WORKSPACE)(w_id, user_id);
            }
            logger_1.default.info("RES : workspace deleted successfully");
            return res.status(200).json({ msg: "workspace deleted" });
        }
        catch (error) {
            logger_1.default.error(`Error in deleting a workspace => ${error}`);
            return res.status(500).json({ msg: "error in deleting a workspace" });
        }
    });
}
function get_workspace_access(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const w_id = req.params.w_id;
            logger_1.default.info(`REQ : get workspace access for w_id => ${w_id}`);
            if (!w_id) {
                logger_1.default.error("workspace id is required while fetching workspace access");
                return res.status(500).json({ mesg: "Workspace id is required" });
            }
            if (typeof w_id == "string") {
                let data = yield (0, workspace_service_1.GET_WORKSPACE_ACCESS)(w_id);
                logger_1.default.info(`RES : fetched workspace access => ${data} `);
                return res.status(200).json(data);
            }
            logger_1.default.error("Invalid workspace id");
            return res.status(500).json({ msg: "Invalid workspace id" });
        }
        catch (error) {
            logger_1.default.error("Internal Server Error");
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    });
}
function Remove_Workspace_Access(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info("REQ : Requesting to Remove workspace access");
            const { workspace_id, email } = req.body;
            if (!workspace_id && !email) {
                logger_1.default.error("Workspace id and email is required");
                return res
                    .status(500)
                    .json({ msg: "workspace id and email is required" });
            }
            const data = yield (0, workspace_service_1.DELETE_WORKSPACE_ACCESS)({ workspace_id, email });
            logger_1.default.info(`RES : workspace access removed from email => ${email}`);
            return res.status(200).json({ msg: "Workspace access removed", data });
        }
        catch (error) {
            logger_1.default.error("Internal Server Error");
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    });
}
function editWorkspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, name, description } = req.body;
            const owner_id = req.user_id;
            const updatedWorkspace = yield (0, workspace_service_1.EDIT_WORKSPACE)(id, { name, description }, owner_id);
            if (!updatedWorkspace) {
                return res.status(404).json({
                    message: "Workspace Not Found",
                });
            }
            if (updatedWorkspace) {
                logger_1.default.info(`Workspace with id ${id} edited successfully`);
                return res.status(200).json({
                    message: "Workspace edited successfully",
                    data: updatedWorkspace,
                });
            }
            else {
                logger_1.default.error(`Workspace with id ${id} not found or could not be edited`);
                return res
                    .status(404)
                    .json({ message: "Workspace not found or could not be edited" });
            }
        }
        catch (error) {
            logger_1.default.error(`Error editing workspace: ${error}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
function remove_shared_workspaces(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { workspace_id, email } = req.body;
            logger_1.default.info(`REQ : remove shared workspace for email => ${email} & workspace_id => ${workspace_id}}`);
            if (workspace_id && email) {
                const data = yield (0, workspace_service_1.REMOVE_SHARED_WORKSPACES)(workspace_id, email);
                logger_1.default.info("Shared workspace has been removed successfully");
                return res.status(200).json({ msg: "Shared workspace has been removed" });
            }
            logger_1.default.error("workspace id or email is not provided in the body");
            return res
                .status(500)
                .json({ msg: "Workspace id or email is not provided in body" });
        }
        catch (error) {
            logger_1.default.error(`Internal server error while removing shared workspace => ${error}`);
            return res.status(500).json({ msg: `Internal server error => ${error}` });
        }
    });
}
