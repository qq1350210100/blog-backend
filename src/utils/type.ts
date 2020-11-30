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

export type StrArray = number[] | string[] | string

export interface ArticleInfo {
  articleId: number
  introduce: string
  sort: string
  title: string
  author: string
  views: number
  tags: StrArray
  likes: StrArray
  backgroundImage: string
  creationTime: number
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
