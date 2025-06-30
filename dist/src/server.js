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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/dbConnect");
const app = express();
const cors = require("cors");
const workspace = require("./Routes/workspace.route");
const categoryRouter = require("./Routes/category.route");
const snippet = require("./Routes/snippet.route");
const Share = require("./Routes/share.route");
const user = require("./Routes/user.route");
dotenv.config();
db();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/v1/api/workspace", workspace);
app.use("/v1/api/category", categoryRouter);
app.use("/v1/api/snippet", snippet);
app.use("/v1/api/share", Share);
app.use("/v1/api/user", user);
app.get("/serverUp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ msg: "Server is awake!" });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
app.listen(PORT, '0.0.0.0', () => {
    console.log(`App is running on http://0.0.0.0:${PORT}`);
});
