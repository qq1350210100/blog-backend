import { db } from '../utils/mysql'
import { throwSqlError, where } from './util'
import { Account, FormatedProfile, Profile } from '../utils/type'
import { WhereKey } from '../utils/enums'

type FindUserResult = Promise<
  | {
      account: Account
      profile: FormatedProfile
    }
  | undefined
>

async function _updateOnline(online: boolean, whereSql: string): Promise<void> {
  try {
    const sql = /*sql*/ `UPDATE blog.user SET is_online = ${online ? 1 : 0} ${whereSql};`
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

async function _find(whereSql: string): FindUserResult {
  const sql = /*sql*/ `
    SELECT 
      username,
      password,
      id AS userId,
      nickname,
      avatar,
      gender,
      self_introduction AS selfIntroduction,
      level,
      is_online AS isOnline,
      github,
      email,
      phone,
      wechat
    FROM blog.user ${whereSql};
  `
  try {
    const results = (await db.query(sql)) as Account[] & Profile[]
    if (!results.length) return

    const { username, password, ...profile } = results[0]
    const { github, email, phone, wechat } = profile
    return {
      account: {
        username,
        password
      },
      profile: {
        ...profile,
        contacts: { github, email, phone, wechat }
      }
    }
  } catch (err) {
    throwSqlError(err)
  }
}

async function _validate(password: string, whereSql: string): Promise<boolean> {
  const sql = /*sql*/ `SELECT password FROM blog.user ${whereSql};`
  try {
    const results = (await db.query(sql)) as { password: string }[]
    if (!results.length) return false
    return results[0].password === password
  } catch (err) {
    throwSqlError(err)
  }
  return false
}

export async function create(username: string, password: string, profile: Profile): Promise<void> {
  const sql = /*sql*/ `
    INSERT INTO blog.user SET
      username = "${username}",
      password = "${password}",
      nickname = "${profile.nickname}",
      avatar = "${profile.avatar}",
      gender = "${profile.gender}",
      self_introduction = "${profile.selfIntroduction}",
      github = "${profile.github}",
      phone = "${profile.phone}",
      email = "${profile.email}",
      wechat = "${profile.wechat}",
      level = "${profile.level}",
      is_online = "${profile.isOnline ? 1 : 0}";
  `
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function signIn(username: string, password: string): Promise<void> {
  const whereSql: string = where(WhereKey.USERNAME, username)
  const passed: boolean = await _validate(password, whereSql)
  if (!passed) {
    throw { message: '账号或密码错误', code: 200 }
  }

  await _updateOnline(true, whereSql)
}

export async function signOut(userId: number): Promise<void> {
  await _updateOnline(false, where(WhereKey.USER_ID, userId))
}

export function findById(userId: number): FindUserResult {
  return _find(where(WhereKey.USER_ID, userId))
}

export function findByName(username: string): FindUserResult {
  return _find(where(WhereKey.USERNAME, username))
}

export async function setProfile(userId: number, profile: Profile): Promise<void> {
  const sql = /*sql*/ `
    UPDATE blog.user SET
      nickname = "${profile.nickname}",
      avatar = "${profile.avatar}",
      gender = "${profile.gender}",
      self_introduction = "${profile.selfIntroduction}",
      github = "${profile.github}",
      email = "${profile.email}",
      phone = "${profile.phone}",
      wechat = "${profile.wechat}",
      level = "${profile.level}"
      WHERE id = ${userId};
  `
  try {
    await db.query(sql)
  } catch (err) {}
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
  let limitSql: string = limit ? `LIMIT ${limit}` : ''
  const sql = /*sql*/ `
    SELECT id, username, nickname, avatar FROM blog.user 
    WHERE username LIKE '%${keywords}%' 
    OR nickname LIKE '%${keywords}%'
    ${limitSql};
  `
  try {
    return (await db.query(sql)) as {
      id: number
      username: string
      nickname: string
      avatar: string
    }[]
  } catch (err) {
    throwSqlError(err)
  }
}
