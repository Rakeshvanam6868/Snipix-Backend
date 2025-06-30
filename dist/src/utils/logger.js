"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata'
};
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ level, message, timestamp }) => {
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString('en-IN', options);
        return `${formattedDate} : ${level.toUpperCase()} : ${message}`;
    })),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: "logs/combined.log",
            level: "info"
        }),
        new winston_1.default.transports.File({
            filename: "logs/error.log",
            level: "error"
        }),
    ],
});
exports.default = logger;
