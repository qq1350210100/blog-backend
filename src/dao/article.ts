import { db } from '../utils/mysql'
import { throwSqlError, stringToArray } from './util'
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
      creation_time AS creationTime,
      likes
    FROM article ${whereSql};
  `
  try {
    const results = (await db.query(sql)) as ArticleInfo[]
    return results.map(article => ({
      ...article,
      tags: stringToArray(article.tags),
      likes: stringToArray(article.likes)
    }))
  } catch (err) {
    throwSqlError(err)
  }
}

export function findBySort(sort: string) {
  return _find(sort === 'all' ? '' : `WHERE sort = "${sort}"`)
}

export function findById(id: number) {
  return _find(`WHERE id = ${id}`)
}

export async function getContent(articleId: number) {
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

export async function remove(id: number) {
  const sql = /*sql*/ `DELETE FROM article WHERE id = ${id};`
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function increaseViews(articleId: number, newViews: number) {
  const sql = /*sql*/ `UPDATE article SET views = ${newViews} WHERE id = ${articleId};`
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function setLikes(articleId: number, likes: number[]) {
  const likesStr: string = likes.join(',')
  const sql = /*sql*/ `UPDATE article SET likes = "${likesStr}" WHERE id = ${articleId};`
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}
