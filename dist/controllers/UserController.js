"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("../common/decorator");
const mysql_1 = __importDefault(require("../middlewares/mysql"));
const constant_1 = require("../common/constant");
let UserController = /** @class */ (() => {
    let UserController = class UserController {
        /**
         * 用户登录
         * @param ctx Context
         */
        async userLogin(ctx) {
            const { username, password } = ctx.request.body;
            let status = constant_1.responseStatus.FAIL;
            let response = '登入失败';
            try {
                let sql = `	
				SELECT password FROM user WHERE username = '${username}';
			`;
                const passwords = await ctx.mysql.query(sql);
                if (passwords && passwords.length > 0) {
                    const { password: existPassword } = passwords[0];
                    if (password === existPassword) {
                        try {
                            let sql = `
							UPDATE user SET is_online = 1 WHERE username = '${username}';
						`;
                            await ctx.mysql.query(sql);
                            status = constant_1.responseStatus.OK;
                            response = '登入成功';
                        }
                        catch (e) {
                            console.error('SQL语句执行失败', e);
                        }
                    }
                    else {
                        response = '账号或密码错误!';
                    }
                }
                else {
                    response = '账号不存在!';
                }
            }
            catch (e) {
                console.error('SQL语句执行失败', e);
            }
            ctx.body = {
                status,
                payload: response
            };
        }
        /**
         * 用户注册
         * @param ctx Context
         */
        async userRegister(ctx) {
            const { username, password, nickname = '匿名' } = ctx.request.body;
            let status = constant_1.responseStatus.FAIL;
            let response = '注册失败！';
            if (username && password) {
                try {
                    let sql = `
					SELECT username FROM user WHERE username = '${username}';
				`;
                    const existUsername = await ctx.mysql.query(sql);
                    if (existUsername.length > 0) {
                        response = '该账号已存在！';
                    }
                    else {
                        try {
                            let sql = `
							INSERT INTO user SET 
								username = '${username}', 
								password = '${password}', 
								nickname = '${nickname}';
						`;
                            await ctx.mysql.query(sql);
                            status = constant_1.responseStatus.OK;
                            response = '注册成功！';
                        }
                        catch (e) {
                            console.error('SQL语句执行失败', e);
                        }
                    }
                }
                catch (e) {
                    console.error('SQL语句执行失败', e);
                }
            }
            ctx.body = {
                status,
                payload: response
            };
        }
        /**
         * 用户登出
         * @param ctx Context
         */
        async userLogout(ctx) {
            let status = constant_1.responseStatus.FAIL;
            let response = '登出失败！';
            const { username } = ctx.request.body;
            if (username) {
                try {
                    let sql = `SELECT username FROM user`;
                    const result = await ctx.mysql.query(sql);
                    if (result.length > 0) {
                        try {
                            let sql = `
							UPDATE user SET is_online = 0 WHERE username = '${username}';
						`;
                            await ctx.mysql.query(sql);
                            status = constant_1.responseStatus.OK;
                            response = '登出成功！';
                        }
                        catch (e) {
                            console.error('SQL语句执行失败', e);
                        }
                    }
                    else {
                        response = '账号不存在！';
                    }
                }
                catch (e) {
                    console.error('SQL语句执行失败', e);
                }
            }
            ctx.body = {
                status,
                payload: response
            };
        }
        /**
         * 获取用户基本信息
         * @param ctx Context
         */
        async getUserBaseInfo(ctx) {
            let status = constant_1.responseStatus.FAIL;
            let response = {};
            const { username } = ctx.query;
            try {
                let sql = `
				SELECT 
					id AS userId,
					username,
					nickname,
					level,
					is_online AS isOnline
				FROM user
				WHERE username = '${username}';
			`;
                const result = await ctx.mysql.query(sql);
                if (result.length > 0) {
                    status = constant_1.responseStatus.OK;
                    response = result[0];
                }
            }
            catch (e) {
                console.error('SQL语句执行失败', e);
            }
            ctx.body = {
                status,
                payload: response
            };
        }
    };
    __decorate([
        decorator_1.post('/login', mysql_1.default()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "userLogin", null);
    __decorate([
        decorator_1.post('/register', mysql_1.default()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "userRegister", null);
    __decorate([
        decorator_1.post('/logout', mysql_1.default()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "userLogout", null);
    __decorate([
        decorator_1.get('/baseInfo', mysql_1.default()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "getUserBaseInfo", null);
    UserController = __decorate([
        decorator_1.controller('/user')
    ], UserController);
    return UserController;
})();
exports.default = UserController;
