"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_router_1 = __importDefault(require("koa-router"));
const initRoute_1 = __importDefault(require("./common/initRoute"));
const app = new koa_1.default();
const router = new koa_router_1.default();
app.use(cors_1.default());
initRoute_1.default(app, router);
app.listen(10086);
