var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { controller, post } from '../common/decorator';
import { mysql } from '../middlewares/mysql';
let UserController = /** @class */ (() => {
    let UserController = class UserController {
        /**
         * 用户登录
         * @param ctx
         */
        async userLogin(ctx) {
            const { username, password } = ctx.request.body;
            let status = 'FAIL';
            let response = '登入失败';
            try {
                let getPasswordSql = `select password from user where username = '${username}';`;
                const passwords = await ctx.mysql.query(getPasswordSql);
                if (passwords && passwords.length > 0) {
                    const { password: existPassword } = passwords[0];
                    if (password === existPassword) {
                        try {
                            let onlineSql = `update user set is_online = 1 where username = '${username}';`;
                            await ctx.mysql.query(onlineSql);
                            status = 'OK';
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
         * @param ctx
         */
        async userRegister(ctx) {
            const { username, password, nickname = '匿名' } = ctx.request.body;
            let status = 'FAIL';
            let response = '注册失败！';
            if (username && password) {
                try {
                    let fetchCurrentUsernameSql = `select username from user where username = '${username}';`;
                    const existUsername = await ctx.mysql.query(fetchCurrentUsernameSql);
                    if (existUsername.length > 0) {
                        response = '该账号已存在！';
                    }
                    else {
                        try {
                            let addUserSql = `
							insert into user set 
								username = '${username}', 
								password = '${password}', 
								nickname = '${nickname}';
						`;
                            await ctx.mysql.query(addUserSql);
                            status = 'OK';
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
         * @param ctx
         */
        async userLogout(ctx) {
            let status = 'FAIL';
            let response = 'Logout failed';
            const { username } = ctx.request.body;
            if (username) {
                try {
                    let getUsernameSql = `select username from user`;
                    const result = await ctx.mysql.query(getUsernameSql);
                    if (result.length > 0) {
                        try {
                            let notOnlineSql = `update user set is_online = 0 where username = '${username}';`;
                            await ctx.mysql.query(notOnlineSql);
                            status = 'OK';
                            response = '登出成功！';
                        }
                        catch (e) {
                            console.error('执行SQL语句失败', e);
                        }
                    }
                    else {
                        response = '账号不存在！';
                    }
                }
                catch (e) {
                    console.error('执行SQL语句失败', e);
                }
            }
            ctx.body = {
                status,
                payload: response
            };
        }
    };
    __decorate([
        post('/login', mysql()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "userLogin", null);
    __decorate([
        post('/register', mysql()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "userRegister", null);
    __decorate([
        post('/logout', mysql()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "userLogout", null);
    UserController = __decorate([
        controller('/user')
    ], UserController);
    return UserController;
})();
export default UserController;
