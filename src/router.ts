import { SwaggerRouter } from 'koa-swagger-decorator'
import path from 'path'

const router = new SwaggerRouter()

// swagger docs avaliable at http://localhost:10086/swagger-html
router.swagger()
router.mapDir(path.resolve(__dirname, './controllers/'))

export default router
