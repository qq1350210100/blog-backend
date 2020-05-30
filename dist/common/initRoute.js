"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("./decorator");
__exportStar(require("../controllers/UserController"), exports);
__exportStar(require("../controllers/ArticleController"), exports);
__exportStar(require("../controllers/SettingController"), exports);
function initRoutes(app, router) {
    decorator_1.controllers.forEach((controller) => {
        // 获取每个路由的前缀
        const { constructor: { prefix }, url, method, middleware, handler } = controller;
        const integralUrl = prefix ? prefix + url : url; // 组合完整的url
        console.log(`「METHOD」:${method}, 「PATH」:${integralUrl}`); // 打印请求的路由method,url
        router[method](integralUrl, ...middleware, handler); // 创建路由
    });
    app.use(router.routes()).use(router.allowedMethods()); // 路由装箱
}
exports.default = initRoutes;
