var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { controller, get } from '../common/decorator';
import { mysql } from '../middlewares/mysql';
let ArticleController = /** @class */ (() => {
    let ArticleController = class ArticleController {
        async getArticleList(ctx) {
            const { sort } = ctx.query;
            const sql = `
		  select
		    id               as id,
		    sort             as sort,
		    title            as title,
		    background_image as backgroundImage,
		    author           as author,
		    views            as views,
		    tags             as tags
		  from article
		  ${sort ? `where sort = '${sort}'` : ''};
		`;
            const articleList = await ctx.mysql.query(sql);
            const response = articleList.map((item) => {
                const { tags } = item;
                const tagsList = tags.split(',');
                return { ...item, tags: tagsList };
            });
            ctx.body = {
                status: 'OK',
                payload: response
            };
        }
        async getArticleContent(ctx) {
            const { articleId } = ctx.query;
            const sql = `
			select 
				background_image as backgroundImage, 
				content 
				from article where id = ${articleId};
		`;
            if (articleId) {
                const data = await ctx.mysql.query(sql);
                const payload = data[0];
                ctx.body = {
                    status: 'OK',
                    payload
                };
            }
            else {
                ctx.body = {
                    status: 'FAIL',
                    payload: '缺少参数'
                };
            }
        }
    };
    __decorate([
        get('/list', mysql()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ArticleController.prototype, "getArticleList", null);
    __decorate([
        get('/content', mysql()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ArticleController.prototype, "getArticleContent", null);
    ArticleController = __decorate([
        controller('/article')
    ], ArticleController);
    return ArticleController;
})();
export default ArticleController;
