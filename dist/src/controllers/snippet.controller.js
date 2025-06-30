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
exports.addSnippet = addSnippet;
exports.getSnippets = getSnippets;
exports.shareSnippet = shareSnippet;
exports.delete_snippet = delete_snippet;
exports.global_search_for_snippets = global_search_for_snippets;
exports.edit_snippet = edit_snippet;
exports.has_snippet_access = has_snippet_access;
const snippet_service_1 = require("../services/snippet.service");
const logger_1 = __importDefault(require("../utils/logger"));
const encrypt_1 = require("../utils/encrypt");
const mail_service_1 = require("../services/mail.service");
const send_snippet_1 = require("../utils/mailFormats/send_snippet");
function addSnippet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const BODY = req.body;
        const user_id = req.user_id;
        BODY.user_id = user_id;
        let data;
        logger_1.default.info(`REQ : add a snippet in a category with data => ${BODY}`);
        try {
            data = yield (0, snippet_service_1.ADD_SNIPPET)(BODY);
            logger_1.default.info("RES : a snippet has been added successfully");
            return res
                .status(201)
                .json({ message: "Snippet added successfully", data: data });
        }
        catch (error) {
            logger_1.default.info(`RES : an error occured in adding an snippet => ${error}`);
            return res.status(500).json({
                message: "Error while adding snippet",
                error: error,
            });
        }
    });
}
function getSnippets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let data;
        try {
            const cat_id = req.query.cat_id;
            const snippet_id = req.query.snippet_id;
            if (cat_id && typeof cat_id == "string") {
                logger_1.default.info(`REQ : Fetch all snippets for a particular category => ${cat_id}`);
                data = yield (0, snippet_service_1.FETCH_ALL_SNIPPETS)(cat_id);
            }
            else {
                if (snippet_id && typeof snippet_id == "string") {
                    data = yield (0, snippet_service_1.FETCH_A_SNIPPET)(snippet_id);
                }
                else {
                    logger_1.default.error("No id provided");
                    return res.status(500).json({
                        message: "BAD REQUEST - no id provided",
                    });
                }
            }
            logger_1.default.info(`RESP : Snippets fetched => ${data}`);
            return res.status(200).json(data);
        }
        catch (error) {
            logger_1.default.error(`Error in fetching Snippets => ${error}`);
            return res.status(500).json({
                message: "Error in fetching Snippets",
                error: error,
            });
        }
    });
}
function shareSnippet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { share, email, snippetid, user_name } = req.body;
            const user_id = req.user_id;
            logger_1.default.info(`REQ : Share snippet => ${snippetid}`);
            const id = encodeURIComponent((0, encrypt_1.encrypt)(snippetid));
            logger_1.default.info(`encrypted mongoDB id => ${id}`);
            if (share && user_id) {
                //update the db, that this particular snippet is sharable
                const snippet = yield (0, snippet_service_1.UPDATE_SNIPPET_SHARE_STATUS)(snippetid, user_id);
                if (snippet) {
                    const url = `https://snipsavvy.vercel.app/collab?snippet=${id}&sharing=true`;
                    logger_1.default.info(`snippet sharing url generated => ${url}`);
                    return res.status(200).json({ url: url });
                }
            }
            else {
                if (!email) {
                    return res.status(500).json({ msg: "BAD REQUEST" });
                }
                // write logic for sending link in a mail
                const newemail = encodeURIComponent((0, encrypt_1.encrypt)(email));
                const snippet = (0, snippet_service_1.SHARE_SNIPPET_PERSONALLY)(snippetid, email);
                const url = `https://snipsavvy.vercel.app/collab?snippet=${id}&email=${newemail}`;
                logger_1.default.info(`snippet personal sharing url generated => ${url}`);
                const content = {
                    user_name: user_name,
                    email: email,
                    url: url,
                };
                //send mail
                yield (0, mail_service_1.emailService)(email, `${user_name} has sent you a snippet ⭐`, content, send_snippet_1.send_snippet)
                    .then(() => logger_1.default.info(`Email sent successfully to ${email}`))
                    .catch((error) => logger_1.default.error("Error in sending email:", error));
            }
            return res.status(200).json({ msg: "Snippet shared successfully" });
        }
        catch (error) {
            logger_1.default.error(`Error in sharing snippet => ${error}`);
            return res
                .status(500)
                .json({ msg: "Internal Server Error in sharing snippet" });
        }
    });
}
function delete_snippet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const s_id = req.query.s_id;
            const user_id = req.user_id;
            logger_1.default.info(`REQ : delete a snippet => ${s_id}`);
            if (!s_id) {
                logger_1.default.error("snippet id is required");
                return res
                    .status(500)
                    .json({ msg: "snippet id is required for deleting a snippet" });
            }
            let data;
            if (typeof s_id == "string" && user_id) {
                data = yield (0, snippet_service_1.DELETE_SNIPPET)(s_id, user_id);
            }
            logger_1.default.info(`RES : snippet deleted successfully => ${data}`);
            return res.status(200).json({ msg: "snippet deleted successfully" });
        }
        catch (error) {
            logger_1.default.error("error in deleting a snippet");
            return res.status(500).json({ msg: "Error in deleting a snippet" });
        }
    });
}
function global_search_for_snippets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const text_to_search = req.query.text;
            const user_id = req.user_id;
            if (typeof text_to_search == "string" && user_id) {
                const data = yield (0, snippet_service_1.GLOBAL_SEARCH)(text_to_search, user_id);
                return res.status(200).json(data);
            }
            return res.status(500).json({ msg: "query is not valid" });
        }
        catch (error) {
            return res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
        }
    });
}
function edit_snippet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const Body = req.body;
            const user_id = req.user_id || "";
            const updatedSnippet = yield (0, snippet_service_1.EDIT_SNIPPET)(id, user_id, Body);
            // console.log("updated",updatedSnippet)
            return res.status(200).json(updatedSnippet);
        }
        catch (error) {
            logger_1.default.error("Error in editing snippet");
            return res.status(500).json({ msg: "Error in editing snippet" });
        }
    });
}
function has_snippet_access(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`REQ : Snippet Access check request for => ${req.body.email}`);
            const { snippet_id, email } = req.params;
            const has_access = yield (0, snippet_service_1.CHECK_ACCESS)(snippet_id, email);
            logger_1.default.info(`RES : Snippet Access check response => ${has_access}`);
            if (has_access) {
                return res
                    .status(200)
                    .json({ msg: "Has Access => TRUE", status: has_access });
            }
            return res
                .status(200)
                .json({ msg: "Has Access => FALSE", status: has_access });
        }
        catch (error) {
            logger_1.default.error(`Error : error found in checking snippet access => ${error}`);
            return res
                .status(500)
                .json({ msg: `error found in checking snippet access => ${error}` });
        }
    });
}
