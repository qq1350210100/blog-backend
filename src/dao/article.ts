import { db } from '../utils/mysql'
import { throwSqlError, stringToArray } from './util'
import { ArticleInfo, ArticleDetail, FormatedArticleInfo, Review } from '../utils/type'

const { escape, query } = db

async function internalFind(whereSql: string): Promise<FormatedArticleInfo[] | undefined> {
  const sql = /* sql */ `
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
      collections
    FROM blog.article ${whereSql};
  `
  try {
    const results: ArticleInfo[] = await query(sql)
    return results.map((article) => ({
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
  orderKey: 'creation_time' | 'views' | 'rand()'
): Promise<FormatedArticleInfo[] | undefined> {
  let whereSql: string = category === 'all' ? '' : /* sql */ `WHERE category = ${escape(category)}`
  let orderSql: string = orderKey ? `ORDER BY ${orderKey} DESC` : ''
  return internalFind(`${whereSql} ${orderSql}`)
}

export function findById(id: number): Promise<FormatedArticleInfo[] | undefined> {
  return internalFind(/* sql */ `WHERE id = ${escape(id)}`)
}

export async function getContent(articleId: number): Promise<string | undefined> {
  const sql = /* sql */ `SELECT content FROM blog.article WHERE id = ${escape(articleId)};`
  try {
    const results: { content: string }[] = await query(sql)
    if (!results.length) return
    const [{ content }] = results
    return content
  } catch (err) {
    throwSqlError(err)
  }
}

export async function add(detail: ArticleDetail): Promise<void> {
  const tagsStr = Array.isArray(detail.tags) ? detail.tags.join(',') : ''
  const sql = /* sql */ `
    INSERT INTO blog.article SET 
      background_image = ${escape(detail.backgroundImage)},
      title = ${escape(detail.title)},
      introduce = ${escape(detail.introduce)},
      content = ${escape(detail.content)},
      author = ${escape(detail.author)},
      category = ${escape(detail.category)},
      tags = ${escape(tagsStr)},
      creation_time = ${escape(detail.creationTime)};
  `
  try {
    await query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function remove(id: number): Promise<void> {
  const sql = /* sql */ `DELETE FROM blog.article WHERE id = ${escape(id)};`
  try {
    await query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function increaseViews(articleId: number, newViews: number): Promise<void> {
  const sql = /* sql */ `
    UPDATE blog.article SET views = ${escape(newViews)} WHERE id = ${escape(articleId)};
  `
  try {
    await query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function setLikes(articleId: number, likes: number[]): Promise<void> {
  const likesStr: string = likes.join(',')
  const sql = /* sql */ `UPDATE blog.article SET likes = ${escape(likesStr)} WHERE id = ${escape(
    articleId
  )};`
  try {
    await query(sql)
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
  keywords = escape(`%${keywords}%`)
  let limitSql: string = limit ? `LIMIT ${limit}` : ''
  const sql = /* sql */ `
    SELECT id, title, author, category FROM blog.article 
    WHERE title LIKE ${keywords} 
    OR introduce LIKE ${keywords} 
    OR content LIKE ${keywords}
    ${limitSql};
  `
  try {
    return (await query(sql)) as {
      id: number
      title: string
      author: number
      category: string
    }[]
  } catch (err) {
    throwSqlError(err)
  }
}

export async function comment(articleId: number, userId: number, content: string): Promise<void> {
  const sql = /* sql */ `
    INSERT INTO blog.review SET
      articleId = ${escape(articleId)},
      speaker = ${escape(userId)},
      content = ${escape(content)},
      creation_time = ${escape(new Date().getTime())};
  `
  try {
    await query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

async function internalFindReview(whereSql: string): Promise<Review[] | undefined> {
  const sql = /* sql */ `
    SELECT 
      id AS reviewId,
      speaker,
      articleId,
      content,
      creation_time AS creationTime
    FROM blog.review ${whereSql} ORDER BY creation_time DESC;
  `
  try {
    return (await query(sql)) as Review[]
  } catch (err) {
    throwSqlError(err)
  }
}

export function getReview(reviewId: number) {
  return internalFindReview(/* sql */ `WHERE id = ${escape(reviewId)}`)
}

export function getReviewByUser(userId: number) {
  return internalFindReview(/* sql */ `WHERE speaker = ${escape(userId)}`)
}

export function getReviewByArticle(articleId: number) {
  return internalFindReview(/* sql */ `WHERE articleId = ${escape(articleId)}`)
}
