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
exports.Share_category = Share_category;
exports.Share_workspace = Share_workspace;
const shared_service_1 = require("../services/shared.service");
const logger_1 = __importDefault(require("../utils/logger"));
const response_1 = require("../utils/response");
function Share_category(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info(`REQ : sharing category/workspace with such details => ${req.body}`);
        try {
            const data = yield (0, shared_service_1.SHARE_CATEGORY)(req.body);
            if (data === response_1.RESPONSE_MESSAGES.WHOLE_WORKSPACE_ALREADY_SHARED) {
                logger_1.default.info(`RES : The whole workspace has already been shared`);
                return res
                    .status(400)
                    .json({ message: response_1.RESPONSE_MESSAGES.WHOLE_WORKSPACE_ALREADY_SHARED });
            }
            if (data === response_1.RESPONSE_MESSAGES.CATEGORY_ALREADY_SHARED) {
                logger_1.default.info(`RES : Category already shared`);
                return res
                    .status(400)
                    .json({ message: response_1.RESPONSE_MESSAGES.CATEGORY_ALREADY_SHARED });
            }
            logger_1.default.info(`RES : share to email ${req.body.email} successfully`);
            return res
                .status(201)
                .json({ message: response_1.RESPONSE_MESSAGES.SHARING_SUCCESSFUL, data: data });
        }
        catch (error) {
            logger_1.default.error(`RES : an error occurred while sharing category => ${error}`);
            return res.status(500).json({
                message: response_1.RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
                error: error,
            });
        }
    });
}
function Share_workspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info(`REQ : sharing workspace with such details => ${req.body}`);
        try {
            const data = req.body;
            const response = yield (0, shared_service_1.SHARE_WORKSPACE)(data);
            if (response === response_1.RESPONSE_MESSAGES.WORKSPACE_ALREADY_SHARED) {
                logger_1.default.info(`RES : The whole workspace has already been shared`);
                return res.status(400).json({ message: response_1.RESPONSE_MESSAGES.WORKSPACE_ALREADY_SHARED });
            }
            logger_1.default.info(`RES : Workspace shared successfully`);
            return res.status(201).json({ message: response_1.RESPONSE_MESSAGES.SHARING_SUCCESSFUL, data: response });
        }
        catch (error) {
            logger_1.default.error(`RES : An error occurred while sharing workspace => ${error}`);
            return res.status(500).json({ message: response_1.RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, error: error });
        }
    });
}
