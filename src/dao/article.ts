import { query } from '../utils/mysql'
import { throwSqlError, stringToArray } from './util'
import { ArticleInfo, ArticleDetail, FormatedArticleInfo, Review } from '../utils/type'
import { Query } from '../libs/crud'

function internalFind(): Query {
  return query()
    .select(
      'id',
      'category',
      'title',
      'author',
      'background_image AS backgroundImage',
      'views',
      'creation_time AS creationTime',
      'introduce',
      'tags',
      'likes',
      'collections'
    )
    .from('blog.article')
}

export async function findAndSort(
  category: string,
  orderKey: 'creation_time' | 'views' | 'rand()' = 'creation_time'
): Promise<FormatedArticleInfo[] | undefined> {
  try {
    let results: ArticleInfo[] = []
    if (category === 'all') {
      results = await internalFind().orderBy(orderKey).desc().end()
    } else {
      results = await internalFind()
        .where()
        .equal('category', category)
        .orderBy(orderKey)
        .desc()
        .end()
    }

    return results.map(article => ({
      ...article,
      tags: stringToArray(article.tags),
      likes: stringToArray(article.likes).map(Number)
    }))
  } catch (err) {
    throwSqlError(err)
  }
}

export async function findById(id: number): Promise<FormatedArticleInfo[] | undefined> {
  try {
    const results: ArticleInfo[] = await internalFind().where().equal('id', id).end()
    return results.map(article => ({
      ...article,
      tags: stringToArray(article.tags),
      likes: stringToArray(article.likes).map(Number)
    }))
  } catch (err) {
    throwSqlError(err)
  }
}

export async function getContent(articleId: number): Promise<string | undefined> {
  try {
    const results: { content: string }[] = await query()
      .select('content')
      .from('blog.article')
      .where()
      .equal('id', articleId)
      .end()
    if (!results.length) return
    const [{ content }] = results
    return content
  } catch (err) {
    throwSqlError(err)
  }
}

export async function add(detail: ArticleDetail): Promise<void> {
  const tagsStr = Array.isArray(detail.tags) ? detail.tags.join(',') : ''
  try {
    await query()
      .insertInto('blog.article')
      .set({
        background_image: detail.backgroundImage,
        title: detail.title,
        content: detail.content,
        author: detail.author,
        category: detail.category,
        creation_time: detail.creationTime,
        tags: tagsStr
      })
      .end()
  } catch (err) {
    throwSqlError(err)
  }
}

export async function remove(id: number): Promise<void> {
  try {
    await query().delete().from('blog.article').where().equal('id', id).end()
  } catch (err) {
    throwSqlError(err)
  }
}

export async function increaseViews(articleId: number, views: number): Promise<void> {
  try {
    await query().update('blog.article').set({ views }).where().equal('id', articleId).end()
  } catch (err) {
    throwSqlError(err)
  }
}

export async function setLikes(articleId: number, likes: number[]): Promise<void> {
  const likesStr: string = likes.join(',')
  try {
    await query()
      .update('blog.article')
      .set({ likes: likesStr })
      .where()
      .equal('id', articleId)
      .end()
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
  try {
    return await query()
      .select('id', 'title', 'author', 'category')
      .from('blog.article')
      .where()
      .like('title', `%${keywords}%`)
      .or()
      .like('introduce', `%${keywords}%`)
      .or()
      .like('content', `%${keywords}%`)
      .limit(limit)
      .end()
  } catch (err) {
    throwSqlError(err)
  }
}

export async function comment(articleId: number, userId: number, content: string): Promise<void> {
  try {
    await query()
      .insertInto('blog.review')
      .set({
        articleId,
        speaker: userId,
        creation_time: new Date().getTime(),
        content
      })
      .end()
  } catch (err) {
    throwSqlError(err)
  }
}

function internalFindReview(): Query | undefined {
  return query()
    .select('id AS reviewId', 'speaker', 'articleId', 'content', 'creation_time AS creationTime')
    .from('blog.review')
}

export function getReview(reviewId: number): Promise<Review[]> {
  const reviews = internalFindReview()
  if (!reviews) return Promise.resolve([])
  return reviews.where().equal('id', reviewId).orderBy('creation_time').desc().end()
}

export function getReviewByUser(userId: number): Promise<Review[]> {
  const reviews = internalFindReview()
  if (!reviews) return Promise.resolve([])
  return reviews.where().equal('speaker', userId).orderBy('creation_time').desc().end()
}

export function getReviewByArticle(articleId: number): Promise<Review[]> {
  const reviews = internalFindReview()
  if (!reviews) return Promise.resolve([])
  return reviews.where().equal('articleId', articleId).orderBy('creation_time').desc().end()
}
