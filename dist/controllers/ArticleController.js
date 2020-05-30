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
let ArticleController = /** @class */ (() => {
    let ArticleController = class ArticleController {
        /**
         * 获取文章列表
         * @param ctx Context
         */
        async getArticleList(ctx) {
            let status = 'FAIL';
            let response = '没有数据';
            const { sort } = ctx.query;
            const articleList = await ctx.mysql.query(`
			SELECT
				id               AS id,
				sort             AS sort,
				title            AS title,
				background_image AS backgroundImage,
				author           AS author,
				views            AS views,
				tags             AS tags
			FROM article
			${sort ? `WHERE sort = '${sort}'` : ''};
		`);
            if (articleList.length > 0) {
                status = 'OK';
                response = articleList.map((item) => {
                    const { tags } = item;
                    const tagsList = tags.split(',');
                    return { ...item, tags: tagsList };
                });
            }
            ctx.body = {
                status,
                payload: response
            };
        }
        /**
         * 获取文章详细内容
         * @param ctx Context
         */
        async getArticleDetail(ctx) {
            let status = 'FAIL';
            let response = '没有数据';
            const { articleId } = ctx.query;
            if (articleId) {
                try {
                    const data = await ctx.mysql.query(`
					SELECT 
						background_image AS backgroundImage, 
						title,
						author,
						introduce,
						content,
						views,
						tags 
					FROM article WHERE id = ${articleId};
				`);
                    const result = data[0];
                    if (result) {
                        const { tags } = result;
                        const tagArr = tags ? tags.split(',') : [];
                        status = 'OK';
                        response = { ...result, articleId, tags: tagArr };
                    }
                }
                catch (e) {
                    console.error('SQL语句执行失败');
                }
            }
            ctx.body = {
                status,
                payload: response
            };
        }
        /**
         * 添加文章
         * @param ctx Context
         */
        async addArticle(ctx) {
            let status = 'FAIL';
            let response = null;
            const { nickname, title, content, sort, tags = [] } = ctx.request.body;
            let tagsStr = '';
            if (tags.length > 0) {
                tagsStr = tags.join(',');
            }
            try {
                await ctx.mysql.query(`
				INSERT INTO article SET 
					title = '${title}',
					content = '${content}',
					author = '${nickname}',
					sort = '${sort}',
					tags = '${tagsStr}';
			`);
                status = 'OK';
                response = '添加成功';
            }
            catch (e) {
                console.error('SQL语句执行失败');
            }
            ctx.body = {
                status,
                payload: response
            };
        }
    };
    __decorate([
        decorator_1.get('/list', mysql_1.default()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ArticleController.prototype, "getArticleList", null);
    __decorate([
        decorator_1.get('/detail', mysql_1.default()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ArticleController.prototype, "getArticleDetail", null);
    __decorate([
        decorator_1.post('/add_article', mysql_1.default()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ArticleController.prototype, "addArticle", null);
    ArticleController = __decorate([
        decorator_1.controller('/article')
    ], ArticleController);
    return ArticleController;
})();
exports.default = ArticleController;
