"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const snippet_controller_1 = require("../controllers/snippet.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const express_1 = __importDefault(require("express"));
const snippet = express_1.default.Router();
snippet.post("/", authMiddleware, snippet_controller_1.addSnippet);
snippet.get("/", authMiddleware, snippet_controller_1.getSnippets);
snippet.put("/share", authMiddleware, snippet_controller_1.shareSnippet);
snippet.delete("/", authMiddleware, snippet_controller_1.delete_snippet);
snippet.get("/global", authMiddleware, snippet_controller_1.global_search_for_snippets);
snippet.patch("/:id", authMiddleware, snippet_controller_1.edit_snippet);
snippet.get("/check-access/:snippet_id/:email", authMiddleware, snippet_controller_1.has_snippet_access);
module.exports = snippet;
