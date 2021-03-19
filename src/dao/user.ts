import { query } from '../utils/mysql'
import { throwSqlError } from './util'
import { Account, FormatedProfile, Profile } from '../utils/type'
import { Query } from '../libs/crud/query'

type FindUserResult = Promise<
  | {
      account: Account
      profile: FormatedProfile
    }
  | undefined
>

async function internalUpdateOnlineStatus(
  key: string,
  value: string | number,
  online: boolean
): Promise<void> {
  try {
    await query().update('blog.user').set({ is_online: online }).where().equal(key, value).end()
  } catch (err) {
    throwSqlError(err)
  }
}

function internalFind(): Query {
  return query()
    .select(
      'username',
      'password',
      'id AS userId',
      'nickname',
      'avatar',
      'gender',
      'self_introduction AS selfIntroduction',
      'level',
      'is_online AS isOnline',
      'github',
      'email',
      'phone',
      'wechat'
    )
    .from('blog.user')
}

async function internalValidate(username: string, password: string): Promise<boolean> {
  try {
    const results: { password: string }[] = await query()
      .select('password')
      .from('blog.user')
      .where()
      .equal('username', username)
      .end()
    if (!results.length) return false

    const [result] = results
    return result.password === password
  } catch (err) {
    throwSqlError(err)
    return false
  }
}

export async function create(username: string, password: string, profile: Profile): Promise<void> {
  try {
    await query()
      .insertInto('blog.user')
      .set({
        username,
        password,
        nickname: profile.nickname,
        avatar: profile.avatar,
        gender: profile.gender,
        self_introduction: profile.selfIntroduction,
        github: profile.github,
        phone: profile.phone,
        email: profile.email,
        wechat: profile.wechat,
        level: profile.level,
        is_online: profile.isOnline ? 1 : 0
      })
      .end()
  } catch (err) {
    throwSqlError(err)
  }
}

export async function signIn(username: string, password: string): Promise<void> {
  const passed = await internalValidate(username, password)
  if (!passed) throw { message: '账号或密码错误', code: 200 }

  internalUpdateOnlineStatus('username', username, true)
}

export async function signOut(userId: number): Promise<void> {
  internalUpdateOnlineStatus('userId', userId, false)
}

async function internalFindBy(key: string, value: string | number): FindUserResult {
  try {
    const results: Account[] & Profile[] = await internalFind().where().equal(key, value).end()
    if (!results.length) return

    const [{ username, password, ...profile }] = results
    const { github, email, phone, wechat } = profile
    return {
      account: {
        username,
        password
      },
      profile: {
        ...profile,
        username,
        contacts: { github, email, phone, wechat }
      }
    }
  } catch (err) {
    throwSqlError(err)
  }
}

export function findById(userId: number): FindUserResult {
  return internalFindBy('id', userId)
}

export function findByName(username: string): FindUserResult {
  return internalFindBy('username', username)
}

export async function setProfile(userId: number, profile: Profile): Promise<void> {
  try {
    await query()
      .update('blog.user')
      .set({
        nickname: profile.nickname,
        avatar: profile.avatar,
        gender: profile.gender,
        self_introduction: profile.selfIntroduction,
        github: profile.github,
        email: profile.email,
        phone: profile.phone,
        wechat: profile.wechat,
        level: profile.level
      })
      .where()
      .equal('id', userId)
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
      username: string
      nickname: string
      avatar: string
    }[]
  | undefined
> {
  try {
    return await query()
      .select('id', 'username', 'nickname', 'avatar')
      .from('blog.user')
      .where()
      .like('username', `%${keywords}%`)
      .or()
      .like('nickname', `%${keywords}%`)
      .limit(limit)
      .end()
  } catch (err) {
    throwSqlError(err)
  }
}
