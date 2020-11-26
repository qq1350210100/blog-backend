import { db } from '../utils/mysql'
import { throwSqlError, convertTags } from './util'
import { ArticleInfo, ArticleDetail } from '../utils/type'

async function _find(whereSql: string) {
  const sql = /*sql*/ `
    SELECT
      id,
      sort,
      title,
      author,
      background_image AS backgroundImage,
      views,
      tags,
      creation_time AS creationTime
    FROM article ${whereSql};
  `
  try {
    const results = (await db.query(sql)) as ArticleInfo[]
    return results.map(article => ({ ...article, tags: convertTags(article.tags) }))
  } catch (err) {
    throwSqlError(err)
  }
}

export function findBySort(sort: string) {
  return _find(sort === 'all' ? '' : `WHERE sort = "${sort}"`)
}

export function findById(id: string) {
  return _find(`WHERE id = ${id}`)
}

export async function getContent(articleId: string) {
  const sql = /*sql*/ `SELECT content FROM article WHERE id = ${articleId};`
  try {
    const results = (await db.query(sql)) as { content: string }[]
    if (!results.length) return
    return results[0].content
  } catch (err) {
    throwSqlError(err)
  }
}

export async function add(detail: ArticleDetail) {
  const tagsStr = Array.isArray(detail.tags) ? detail.tags.join(',') : ''
  const sql = /*sql*/ `
    INSERT INTO article SET 
      background_image = "${detail.backgroundImage}",
      title = "${detail.title}",
      introduce = "${detail.introduce}",
      content = "${detail.content}",
      author = "${detail.author}",
      sort = "${detail.sort}",
      tags = "${tagsStr}",
      creation_time = "${detail.creationTime}";
  `
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function remove(id: string) {
  const sql = /*sql*/ `DELETE FROM article WHERE id = ${id};`
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}
