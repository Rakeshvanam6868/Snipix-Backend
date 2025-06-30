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
exports.ADD_SNIPPET = ADD_SNIPPET;
exports.FETCH_ALL_SNIPPETS = FETCH_ALL_SNIPPETS;
exports.FETCH_A_SNIPPET = FETCH_A_SNIPPET;
exports.UPDATE_SNIPPET_SHARE_STATUS = UPDATE_SNIPPET_SHARE_STATUS;
exports.SHARE_SNIPPET_PERSONALLY = SHARE_SNIPPET_PERSONALLY;
exports.DELETE_SNIPPET = DELETE_SNIPPET;
exports.GLOBAL_SEARCH = GLOBAL_SEARCH;
exports.EDIT_SNIPPET = EDIT_SNIPPET;
exports.CHECK_ACCESS = CHECK_ACCESS;
const snippet_model_1 = __importDefault(require("../models/snippet.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const shared_model_1 = __importDefault(require("../models/shared.model"));
function ADD_SNIPPET(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snippetData = yield snippet_model_1.default.create(body);
            return snippetData;
        }
        catch (error) {
            logger_1.default.error(`Caught in snippet service => ${error}`);
            throw error;
        }
    });
}
function FETCH_ALL_SNIPPETS(c_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snippetsData = yield snippet_model_1.default.find({ category_id: c_id });
            return snippetsData;
        }
        catch (error) {
            logger_1.default.error(`Caught error in snippet service while fetching snippets => ${error}`);
            throw error;
        }
    });
}
function FETCH_A_SNIPPET(s_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snippetsData = yield snippet_model_1.default.find({ _id: s_id }); // [FIXME] removed user_id check, for sharing purpose, need to fix this in future
            return snippetsData;
        }
        catch (error) {
            logger_1.default.error(`Caught error in snippet service while fetching a single snippets => ${error}`);
            throw error;
        }
    });
}
function UPDATE_SNIPPET_SHARE_STATUS(snippet_id, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snippetsData = yield snippet_model_1.default.updateOne({ _id: snippet_id, user_id }, { share_status: true });
            return snippetsData;
        }
        catch (error) {
            logger_1.default.error(`Caught error in snippet service while updating snippet share status => ${error}`);
            throw error;
        }
    });
}
function SHARE_SNIPPET_PERSONALLY(snippet_id, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snippetsData = yield shared_model_1.default.create({
                snippet_id: snippet_id,
                email: email,
                shared_data: "snippet",
            });
            return snippetsData;
        }
        catch (error) {
            logger_1.default.error(`Caught error in snippet service while sharing snippet personally => ${error}`);
            throw error;
        }
    });
}
function DELETE_SNIPPET(id, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield snippet_model_1.default.deleteOne({ _id: id, user_id });
            return {
                message: "snippet deleted successfully",
            };
        }
        catch (error) {
            logger_1.default.error("Caught error in snippet service while deleting a snippet");
            throw error;
        }
    });
}
function GLOBAL_SEARCH(text, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield snippet_model_1.default.find({
                $or: [
                    { title: { $regex: text, $options: "i" } },
                    { description: { $regex: text, $options: "i" } },
                    { tags: { $regex: text, $options: "i" } },
                ],
                user_id,
            });
            return result;
        }
        catch (error) {
            logger_1.default.error(`Caught error in snippet service while doing global search => ${error}`);
            throw error;
        }
    });
}
// export interface SNIP_SCHEMA {
//   title: string;
//   description: string;
//   code: string;
//   tags: string[];
// }
function EDIT_SNIPPET(id, user_id, Body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedSnippet = yield snippet_model_1.default.findOneAndUpdate({ _id: id, user_id }, { $set: Object.assign({}, Body) }, { new: true });
            console.log("updated", updatedSnippet);
            return updatedSnippet;
        }
        catch (error) {
            logger_1.default.error(`Error editing snippet: ${error}`);
            throw error;
        }
    });
}
function CHECK_ACCESS(snippet_id, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snippet = yield shared_model_1.default.findOne({
                _id: snippet_id,
                email,
                shared_data: "snippet",
            });
            if (snippet) {
                return true;
            }
            return false;
        }
        catch (error) {
            logger_1.default.error(`Caught error in snippet service while checking for snippet access => ${error}`);
            throw error;
        }
    });
}
