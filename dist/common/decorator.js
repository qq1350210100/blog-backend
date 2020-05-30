"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.put = exports.post = exports.get = exports.requestMapping = exports.controller = exports.controllers = void 0;
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const constant_1 = require("./constant");
/**
 * 定义注册的路由数组
 */
exports.controllers = [];
/**
 * controller类装饰器
 * @param {string} prefix // 请求路径前缀
 */
exports.controller = (prefix = '') => (target) => {
    target.prefix = prefix;
    // 给controller类添加路由前缀
    console.log('Controller: ', target);
};
function requestMapping({ url = '', method = '', middleware = [] }) {
    return (target, name, descriptor) => {
        // 如果没有传自定义url，默认取方法名作为url
        if (!url)
            url = name;
        // 创建router需要的数据 url，method，middleware（非必需），最终执行的方法，装饰器对象的构造函数
        const controller = {
            url,
            method,
            middleware,
            handler: target[name],
            constructor: target.constructor
        };
        exports.controllers.push(controller);
    };
}
exports.requestMapping = requestMapping;
exports.get = (url, ...middleware) => requestMapping({ method: constant_1.requestMethod.GET, url, middleware });
exports.post = (url, ...middleware) => requestMapping({ method: constant_1.requestMethod.POST, url, middleware: [koa_bodyparser_1.default(), ...middleware] });
exports.put = (url, ...middleware) => requestMapping({ method: constant_1.requestMethod.PUT, url, middleware: [koa_bodyparser_1.default(), ...middleware] });
