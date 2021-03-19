import { Mysql } from './database'
import { Query } from './query'

const dbConfig = {
  database: 'blog',
  multipleStatements: true, //允许多条sql同时执行
  insecureAuth: true,
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  port: 3306
}

const db = new Mysql(dbConfig)
const query = new Query(db)

// ;(async () => {
//   try {
//     const results = await query
//       .insertInto('blog.user')
//       .set({
//         username: 'username233',
//         password: 'password',
//         nickname: 'nickname',
//         avatar: 'avatar',
//         gender: 'gender',
//         self_introduction: 'self_introduction',
//         github: 'github',
//         phone: 'phone',
//         email: 'email',
//         wechat: 'wechat',
//         level: '0',
//         is_online: '1'
//       })
//       .end()

//     console.log('results: ', results)
//   } catch (error) {
//     console.log('error: ', error)
//   }
// })()

console.log('run')
