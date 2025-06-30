"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
const encrypt_1 = require("../config/encrypt");
const logger_1 = __importDefault(require("./logger"));
const CryptoJS = require("crypto-js");
function encrypt(id) {
    try {
        logger_1.default.info("encrypting the mongodb id ......");
        logger_1.default.info("Encryption key:", encrypt_1.encryption_key);
        const encrypt = "1234@4321";
        const encryptedObjectId = CryptoJS.AES.encrypt(id, encrypt).toString();
        return encryptedObjectId;
    }
    catch (error) {
        logger_1.default.error(`Caught error in encrypting the mongoDB id => ${error} `);
    }
}
