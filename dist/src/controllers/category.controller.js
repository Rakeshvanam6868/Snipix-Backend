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
exports.createCategory = createCategory;
exports.fetchCategoriesByWorkspace = fetchCategoriesByWorkspace;
exports.deleteCategories = deleteCategories;
exports.updateCategory = updateCategory;
const logger_1 = __importDefault(require("../utils/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const category_service_1 = require("../services/category.service");
function createCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`REQ : Create a Category with the given data ${req.body}`);
            const data = yield (0, category_service_1.CREATE_CATEGORY)(req.body);
            if (!data) {
                return res.status(404).json({
                    message: "Workspace not found",
                });
            }
            logger_1.default.info(`RESP : Category created => ${data}`);
            return res.status(201).json({
                message: "Category created successfully",
                data,
            });
        }
        catch (error) {
            logger_1.default.error(`Error in creating a category => ${error}`);
            return res.status(500).json({
                message: "Error in creating a category",
                error,
            });
        }
    });
}
function fetchCategoriesByWorkspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspace_id = new mongoose_1.default.Types.ObjectId(req.params.workspace_id);
        logger_1.default.info(`REQ : Fetch all categories for a particular workspace => ${workspace_id}`);
        try {
            const data = yield (0, category_service_1.FETCH_CATEGORIES_BY_WORKSPACE)(workspace_id);
            if (!data) {
                return res.status(404).json({
                    message: "Categories not found for the workspace",
                });
            }
            logger_1.default.info(`RESP : Categories fetched => ${data}`);
            return res.status(200).json(data);
        }
        catch (error) {
            logger_1.default.error(`Error fetching categories => ${error}`);
            return res.status(500).json({
                message: "Error fetching categories",
                error: error,
            });
        }
    });
}
function deleteCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspace_id, category_id } = req.body;
        try {
            logger_1.default.info(`REQ : Delete a Category with ID ${category_id}`);
            const deleted = yield (0, category_service_1.DELETE_CATEGORIES)(workspace_id, category_id);
            if (!deleted) {
                return res.status(404).json({
                    message: "Category not found",
                });
            }
            logger_1.default.info("Category deleted successfully");
            return res.status(200).json({
                message: "Category deleted successfully",
            });
        }
        catch (error) {
            logger_1.default.error(`Error deleting category: ${error}`);
            return res.status(500).json({
                message: "Error deleting category",
                error,
            });
        }
    });
}
function updateCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspace_id, category_id } = req.params;
        try {
            logger_1.default.info(`REQ : Update Category ${category_id} for Workspace ${workspace_id}`);
            const updatedData = yield (0, category_service_1.UPDATE_CATEGORY)(workspace_id, category_id, req.body);
            if (!updatedData) {
                return res.status(404).json({
                    message: "Category not found",
                });
            }
            logger_1.default.info(`RESP : Category updated => ${updatedData}`);
            return res.status(200).json({
                message: "Category updated successfully",
                data: updatedData,
            });
        }
        catch (error) {
            logger_1.default.error(`Error updating category => ${error}`);
            return res.status(500).json({
                message: "Error updating category",
                error: error,
            });
        }
    });
}
