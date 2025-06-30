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
exports.CREATE_CATEGORY = CREATE_CATEGORY;
exports.FETCH_CATEGORIES_BY_WORKSPACE = FETCH_CATEGORIES_BY_WORKSPACE;
exports.DELETE_CATEGORIES = DELETE_CATEGORIES;
exports.UPDATE_CATEGORY = UPDATE_CATEGORY;
const workspace_model_1 = require("../models/workspace.model");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const snippet_model_1 = __importDefault(require("../models/snippet.model"));
function CREATE_CATEGORY(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const workspace_id = new mongoose_1.default.Types.ObjectId(data.id);
            const existingWorkspace = yield workspace_model_1.Workspace.findById({ _id: workspace_id });
            if (!existingWorkspace) {
                logger_1.default.error("Workspace not found");
                return null;
            }
            const newCategory = {
                name: data.name,
                description: data.description,
            };
            (_a = existingWorkspace.categories) === null || _a === void 0 ? void 0 : _a.push(newCategory);
            const updatedWorkspace = yield existingWorkspace.save();
            return updatedWorkspace;
        }
        catch (error) {
            logger_1.default.error("Error creating category:", error);
            throw error;
        }
    });
}
function FETCH_CATEGORIES_BY_WORKSPACE(workspace_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const workspace = yield workspace_model_1.Workspace.findById({ _id: workspace_id });
            if (!workspace) {
                throw new Error("Workspace not found");
            }
            return workspace.categories;
        }
        catch (error) {
            throw error;
        }
    });
}
function DELETE_CATEGORIES(workspace_id, category_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const workspace = yield workspace_model_1.Workspace.findById(workspace_id);
            if (!workspace) {
                logger_1.default.error("Workspace not found");
                return false;
            }
            workspace.categories = (_a = workspace.categories) === null || _a === void 0 ? void 0 : _a.filter((category) => { var _a; return ((_a = category._id) === null || _a === void 0 ? void 0 : _a.toString()) != category_id.toString(); });
            yield workspace.save();
            logger_1.default.info("Category deleted successfully");
            yield snippet_model_1.default.deleteMany({ category_id });
            logger_1.default.info("Snippets deleted successfully");
            return true;
        }
        catch (error) {
            logger_1.default.error("Error deleting category:", error);
            throw error;
        }
    });
}
function UPDATE_CATEGORY(workspace_id, category_id, updatedData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const workspace = yield workspace_model_1.Workspace.findOne({ _id: workspace_id });
            if (typeof workspace === "undefined" || !workspace) {
                logger_1.default.error("Workspace not found");
                return null;
            }
            if (!workspace.categories) {
                logger_1.default.error("Categories not found in workspace");
                return null;
            }
            const matchingCategory = workspace.categories.find((category) => category._id.toString() === category_id.toString());
            if (matchingCategory) {
                console.log(matchingCategory);
            }
            else {
                console.log("Matching category not found");
            }
            if (!matchingCategory) {
                logger_1.default.error("Category not found");
                return null;
            }
            matchingCategory.name = updatedData.name;
            // Save the updated workspace
            const updatedWorkspace = yield workspace.save();
            return updatedWorkspace;
        }
        catch (error) {
            logger_1.default.error("Error in category service while updating the category:", error);
            throw error;
        }
    });
}
