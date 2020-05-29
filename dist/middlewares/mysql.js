"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysql = void 0;
const mysql_1 = __importDefault(require("../database/mysql"));
exports.mysql = () => async (ctx, next) => {
    ctx.mysql = mysql_1.default;
    await next();
};
