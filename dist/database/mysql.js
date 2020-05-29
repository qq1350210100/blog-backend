"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const config = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'blog',
    port: 3306,
    multipleStatements: true //允许多条sql同时执行
};
const pool = mysql_1.default.createPool(config);
class Mysql {
    constructor() { }
    query(sql) {
        return new Promise((resolve, reject) => {
            pool.query(sql, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    }
}
const mysqlDB = new Mysql();
exports.default = mysqlDB;
