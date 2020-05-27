import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import initRoutes from './common/initRoute';
const app = new Koa();
const router = new Router();
app.use(cors());
initRoutes(app, router);
app.listen(10086);
