import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import koaBody from 'koa-body';
import test from 'src/utils/index';
const app = new Koa();
const router = new Router();
app.use(cors()).use(koaBody()).use(router.routes()).use(router.allowedMethods());
app.listen(10086);
console.log('test', test);
// router
// 	.get('/api/articleList', controller.article.getArticleList)
// 	.get('/api/articleContent', controller.article.getArticleContent)
