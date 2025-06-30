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
exports.CREATE_WORKSPACE = CREATE_WORKSPACE;
exports.FETCH_ALL_WORKSPACES = FETCH_ALL_WORKSPACES;
exports.DELETE_WORKSPACE = DELETE_WORKSPACE;
exports.GET_WORKSPACE_ACCESS = GET_WORKSPACE_ACCESS;
exports.DELETE_WORKSPACE_ACCESS = DELETE_WORKSPACE_ACCESS;
exports.EDIT_WORKSPACE = EDIT_WORKSPACE;
exports.FETCH_SHARED_WORKSPACES = FETCH_SHARED_WORKSPACES;
exports.REMOVE_SHARED_WORKSPACES = REMOVE_SHARED_WORKSPACES;
const workspace_model_1 = require("../models/workspace.model");
const snippet_model_1 = __importDefault(require("../models/snippet.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const shared_model_1 = __importDefault(require("../models/shared.model"));
function CREATE_WORKSPACE(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield workspace_model_1.Workspace.create(data);
            return resp;
        }
        catch (error) {
            logger_1.default.error(`Caught error in workspace service while creating a workspace => ${error}`);
            throw error;
        }
    });
}
function FETCH_ALL_WORKSPACES(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // for a particular user
        try {
            const resp = yield workspace_model_1.Workspace.find({ owner: id }).select("name description");
            return resp;
        }
        catch (error) {
            logger_1.default.error(`Caught error in workspace service while fetching workspaces => ${error}`);
            throw error;
        }
    });
}
function DELETE_WORKSPACE(id, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield workspace_model_1.Workspace.deleteOne({ _id: id, owner: user_id });
            yield snippet_model_1.default.deleteMany({ workspace_id: id });
            return {
                message: "Workspace deleted successfully",
            };
        }
        catch (error) {
            logger_1.default.error("Caught error in workspace service while deleting a workspace");
            throw error;
        }
    });
}
function GET_WORKSPACE_ACCESS(w_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield shared_model_1.default.find({
                workspace_id: w_id,
                shared_data: "workspace",
            }).select("workspace_id email");
            return data;
        }
        catch (error) {
            logger_1.default.error(`Caught error in workspace service while fetching the workspace access`);
            throw error;
        }
    });
}
function DELETE_WORKSPACE_ACCESS(_a) {
    return __awaiter(this, arguments, void 0, function* ({ workspace_id, email, }) {
        try {
            const data = yield shared_model_1.default.deleteOne({
                workspace_id,
                email,
                shared_data: "workspace",
            });
            return data;
        }
        catch (error) {
            logger_1.default.error("Caught error in workspace service while deleting the workspace access");
            throw error;
        }
    });
}
function EDIT_WORKSPACE(Workspace_id, updatedWorkspaceData, owner_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingWorkspace = yield workspace_model_1.Workspace.findOne({
                _id: Workspace_id,
                owner: owner_id,
            });
            if (!existingWorkspace) {
                logger_1.default.error(`Workspace with id ${Workspace_id} not found`);
                return null;
            }
            if (updatedWorkspaceData.name !== undefined) {
                existingWorkspace.name = updatedWorkspaceData.name;
            }
            if (updatedWorkspaceData.description !== undefined) {
                existingWorkspace.description = updatedWorkspaceData.description;
            }
            const updatedWorkspace = yield existingWorkspace.save();
            logger_1.default.info(`Workspace with id ${Workspace_id} edited successfully`);
            return updatedWorkspace;
        }
        catch (error) {
            logger_1.default.error(`Error editing workspace: ${error}`);
            throw error;
        }
    });
}
function FETCH_SHARED_WORKSPACES(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield shared_model_1.default.find({ email, shared_data: "workspace" });
            const workspaceIds = data.map((shared) => shared.workspace_id);
            const pipeline = [
                {
                    $match: { workspace_id: { $in: workspaceIds } },
                },
                {
                    $lookup: {
                        from: "workspaces",
                        localField: "workspace_id",
                        foreignField: "_id",
                        as: "workspace",
                    },
                },
                {
                    $unwind: "$workspace",
                },
                {
                    $project: {
                        _id: 0,
                        workspace_id: "$workspace._id",
                        workspace_name: "$workspace.name",
                        workspace_description: "$workspace.description",
                    },
                },
            ];
            const result = yield shared_model_1.default.aggregate(pipeline);
            return result;
        }
        catch (error) {
            console.error(error);
            logger_1.default.error("Caught error in workspace service while fetching shared workspaces");
            throw error;
        }
    });
}
function REMOVE_SHARED_WORKSPACES(workspace_id, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield shared_model_1.default.deleteOne({ workspace_id, email });
            return data;
        }
        catch (error) {
            logger_1.default.error("Caught error in workspace service while removing the shared workspace");
            throw error;
        }
    });
}
