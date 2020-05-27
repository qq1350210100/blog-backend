import mysqlDB from '../database/mysql';
export const mysql = () => async (ctx, next) => {
    ctx.mysql = mysqlDB;
    await next();
};
