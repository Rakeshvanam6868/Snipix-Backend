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
exports.SHARE_CATEGORY = SHARE_CATEGORY;
exports.SHARE_WORKSPACE = SHARE_WORKSPACE;
const logger_1 = __importDefault(require("../utils/logger"));
const shared_model_1 = __importDefault(require("../models/shared.model"));
const response_1 = require("../utils/response");
function SHARE_CATEGORY(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingWorkspaceShared = yield shared_model_1.default.findOne({
                email: data.email,
                workspace_id: data.workspace_id,
                shared_data: "workspace",
            });
            if (existingWorkspaceShared) {
                return response_1.RESPONSE_MESSAGES.WHOLE_WORKSPACE_ALREADY_SHARED;
            }
            const existingCategoryShared = yield shared_model_1.default.findOne({
                email: data.email,
                category_id: data.category_id,
                shared_data: "category",
            });
            if (existingCategoryShared) {
                return response_1.RESPONSE_MESSAGES.CATEGORY_ALREADY_SHARED;
            }
            const newCategoryShared = new shared_model_1.default({
                email: data.email,
                workspace_id: data.workspace_id,
                category_id: data.category_id,
                shared_data: "category",
            });
            yield newCategoryShared.save();
            return newCategoryShared;
        }
        catch (error) {
            logger_1.default.error("Error Sharing category:", error);
            throw error;
        }
    });
}
function SHARE_WORKSPACE(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingWorkspaceShared = yield shared_model_1.default.findOne({
                email: data.email,
                workspace_id: data.workspace_id,
                shared_data: "workspace",
            });
            if (existingWorkspaceShared) {
                return response_1.RESPONSE_MESSAGES.WORKSPACE_ALREADY_SHARED;
            }
            yield shared_model_1.default.deleteMany({
                email: data.email,
                workspace_id: data.workspace_id,
                shared_data: "category",
            });
            const newWorkspaceShared = new shared_model_1.default({
                email: data.email,
                workspace_id: data.workspace_id,
                shared_data: "workspace",
            });
            yield newWorkspaceShared.save();
            return newWorkspaceShared;
        }
        catch (error) {
            logger_1.default.error("Error Sharing workspace:", error);
            throw error;
        }
    });
}
