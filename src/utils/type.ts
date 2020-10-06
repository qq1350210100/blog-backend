import { ReadStream } from 'fs'

export interface AnyObj extends Object {
  [key: string]: any
}

export type Account = {
  username: string
  password: string
}

export type Profile = Partial<{
  userId: string
  nickname: string
  avatar: string
  level: number
  isOnline: boolean
}>

export type Tags = string | string[]

export interface ArticleInfo {
  articleId: string
  introduce: string
  sort: string
  title: string
  author: string
  views: number
  tags: Tags
  backgroundImage: string
}

export type ArticleDetail = ArticleInfo & { content: string }

export interface File extends ReadStream {
  filename: string
}
