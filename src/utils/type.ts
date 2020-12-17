import { ReadStream } from 'fs'

export interface AnyObj extends Object {
  [key: string]: any
}

export type Account = {
  username: string
  password: string
}

export type Profile = Partial<{
  userId: number
  username: string
  nickname: string
  avatar: string
  gender: string
  selfIntroduction: string
  level: number
  isOnline: boolean
  github: string
  wechat: string
  phone: string
  email: string
}>

export type FormatedProfile = Omit<Profile, 'github' | 'wechat' | 'phone' | 'email'> & {
  contacts: Partial<{
    github: string
    wechat: string
    phone: string
    email: string
  }>
}

export type StrArray = number[] | string[] | string

export interface ArticleInfo {
  articleId: number
  introduce: string
  category: string
  title: string
  author: string
  views: number
  tags: StrArray
  likes: StrArray
  backgroundImage: string
  creationTime: number
  collections: string[]
}

export type FormatedArticleInfo = Omit<ArticleInfo, 'tags' | 'likes'> & {
  tags: string[]
  likes: number[]
}

export type ArticleDetail = ArticleInfo & { content: string }

export interface File extends ReadStream {
  filename: string
}

export type UserSetting = {
  drawerDefaultOpened: boolean
  lang: string
  useMarkdownGuide: boolean
  theme: string
}

export type ArticleSordBy = 'latest' | 'popular' | 'random'

export interface Review {
  reviewId: number
  speaker: number
  articleId: number
  content: string
  creation_time: number
}
