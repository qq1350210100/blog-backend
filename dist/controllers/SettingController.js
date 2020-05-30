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
const textMap_1 = require("../utils/textMap");
let SettingController = /** @class */ (() => {
    let SettingController = class SettingController {
        /**
         * 获取用户设置
         * @param ctx Context
         */
        async getSetting(ctx) {
            let status = constant_1.responseStatus.FAIL;
            let response = {};
            const { userId } = ctx.query;
            try {
                let sql = `
				SELECT 
					user.username AS username,
					user.id AS settingId,
					setting.user_id AS userId,
					setting.drawer_opened AS drawerOpened,
					setting.dark_mode AS darkMode,
					setting.theme AS theme,
					setting.sync_to_cloud AS syncToCloud,
					setting.auto_login AS autoLogin,
					setting.lang AS lang
				FROM setting INNER JOIN user ON setting.user_id = user.id 
				WHERE user.id = ${userId};
			`;
                const result = await ctx.mysql.query(sql);
                if (result.length === 1) {
                    response = result[0];
                    status = constant_1.responseStatus.OK;
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
         * 修改用户设置
         * @param ctx Context
         */
        async updateSetting(ctx) {
            let status = constant_1.responseStatus.FAIL;
            let response = '保存失败';
            const { userId, options = {} } = ctx.request.body;
            const finallyOptions = {};
            for (const key in options) {
                if (options.hasOwnProperty(key)) {
                    const value = options[key];
                    finallyOptions[key] = textMap_1.mapToBoolean(value);
                }
            }
            const { drawerOpened, darkMode, theme, syncToCloud, autoLogin, lang } = finallyOptions;
            try {
                let sql = `
				SELECT id as settingId FROM setting WHERE user_id = ${userId};
			`;
                const result = await ctx.mysql.query(sql);
                const exists = result.length > 0;
                try {
                    const setOptionsSql = `
					drawer_opened = ${drawerOpened},
					dark_mode = ${darkMode},
					sync_to_cloud = ${syncToCloud},
					auto_login = ${autoLogin},
					theme = '${theme}',
					lang = '${lang}'
				`;
                    let insertOrUpdateSql = exists
                        ? /*sql*/ `UPDATE setting SET ${setOptionsSql} WHERE user_id = ${userId};`
                        : /*sql*/ `INSERT INTO setting SET ${setOptionsSql}, user_id = ${userId};`;
                    await ctx.mysql.query(insertOrUpdateSql);
                    status = constant_1.responseStatus.OK;
                    response = exists ? '修改成功' : '添加成功';
                }
                catch (e) {
                    console.error('SQL语句执行失败', e);
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
        decorator_1.get('/options', mysql_1.default()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], SettingController.prototype, "getSetting", null);
    __decorate([
        decorator_1.post('/update_options', mysql_1.default()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], SettingController.prototype, "updateSetting", null);
    SettingController = __decorate([
        decorator_1.controller('/setting')
    ], SettingController);
    return SettingController;
})();
exports.default = SettingController;
