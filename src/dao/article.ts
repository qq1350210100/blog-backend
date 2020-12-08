import { db } from '../utils/mysql'
import { throwSqlError, stringToArray } from './util'
import { ArticleInfo, ArticleDetail, FormatedArticleInfo } from '../utils/type'

const { escape } = db

async function _find(whereSql: string): Promise<FormatedArticleInfo[] | undefined> {
  const sql = /*sql*/ `
    SELECT
      id,
      category,
      title,
      author,
      background_image AS backgroundImage,
      views,
      creation_time AS creationTime,
      introduce,
      tags,
      likes,
      collections,
      comments
    FROM blog.article ${whereSql};
  `
  try {
    const results = (await db.query(sql)) as ArticleInfo[]
    return results.map(article => ({
      ...article,
      tags: stringToArray(article.tags),
      likes: stringToArray(article.likes).map(Number)
    }))
  } catch (err) {
    throwSqlError(err)
  }
}

export function findAndSort(
  category: string,
  orderKey?: 'creation_time' | 'views'
): Promise<FormatedArticleInfo[] | undefined> {
  let whereSql: string = category === 'all' ? '' : `WHERE category = "${escape(category)}"`
  let orderSql: string = orderKey ? `ORDER BY ${escape(orderKey)} DESC` : ''
  return _find(`${whereSql} ${orderSql}`)
}

export function findById(id: number): Promise<FormatedArticleInfo[] | undefined> {
  return _find(`WHERE id = ${escape(id)}`)
}

export async function getContent(articleId: number): Promise<string | undefined> {
  const sql = /*sql*/ `SELECT content FROM blog.article WHERE id = ${escape(articleId)};`
  try {
    const results = (await db.query(sql)) as { content: string }[]
    if (!results.length) return
    return results[0].content
  } catch (err) {
    throwSqlError(err)
  }
}

export async function add(detail: ArticleDetail): Promise<void> {
  const tagsStr = Array.isArray(detail.tags) ? detail.tags.join(',') : ''
  const sql = /*sql*/ `
    INSERT INTO blog.article SET 
      background_image = "${escape(detail.backgroundImage)}",
      title = "${escape(detail.title)}",
      introduce = "${escape(detail.introduce)}",
      content = "${escape(detail.content)}",
      author = "${escape(detail.author)}",
      category = "${escape(detail.category)}",
      tags = "${escape(tagsStr)}",
      creation_time = ${escape(detail.creationTime)};
  `
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function remove(id: number): Promise<void> {
  const sql = /*sql*/ `DELETE FROM blog.article WHERE id = ${escape(id)};`
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function increaseViews(articleId: number, newViews: number): Promise<void> {
  const sql = /*sql*/ `
    UPDATE blog.article SET views = ${escape(newViews)} WHERE id = ${escape(articleId)};
  `
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function setLikes(articleId: number, likes: number[]): Promise<void> {
  const likesStr: string = likes.join(',')
  const sql = /*sql*/ `UPDATE blog.article SET likes = "${escape(likesStr)}" WHERE id = ${escape(
    articleId
  )};`
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function search(
  keywords: string,
  limit?: number
): Promise<
  | {
      id: number
      title: string
      author: number
      category: string
    }[]
  | undefined
> {
  keywords = escape(keywords)
  let limitSql: string = limit ? `LIMIT ${limit}` : ''
  const sql = /*sql*/ `
    SELECT id, title, author, category FROM blog.article 
    WHERE title LIKE '%${keywords}%' 
    OR introduce LIKE '%${keywords}%' 
    OR content LIKE '%${keywords}%'
    ${limitSql};
  `
  try {
    return (await db.query(sql)) as {
      id: number
      title: string
      author: number
      category: string
    }[]
  } catch (err) {
    throwSqlError(err)
  }
}
