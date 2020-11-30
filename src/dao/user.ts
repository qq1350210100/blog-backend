import { db } from '../utils/mysql'
import { throwSqlError, where } from './util'
import { Account, Profile } from '../utils/type'
import { WhereKey } from '../utils/enums'

async function _updateOnline(online: boolean, whereSql: string) {
  try {
    const sql = /*sql*/ `UPDATE user SET is_online = ${online ? 1 : 0} ${whereSql};`
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

async function _find(whereSql: string) {
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
    FROM user ${whereSql};
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

async function _validate(password: string, whereSql: string) {
  const sql = /*sql*/ `SELECT password FROM user ${whereSql};`
  try {
    const results = (await db.query(sql)) as { password: string }[]
    if (!results.length) return false
    return results[0].password === password
  } catch (err) {
    throwSqlError(err)
  }
  return false
}

export async function create(username: string, password: string, profile: Profile) {
  const sql = /*sql*/ `
    INSERT INTO user SET
      username = "${username}",
      password = "${password}",
      nickname = "${profile.nickname}",
      avatar = "${profile.avatar}",
      gender = "${profile.gender}",
      self_introduction = "${profile.selfIntroduction}",
      level = "${profile.level}",
      is_online = "${profile.isOnline}";
  `
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function signIn(username: string, password: string) {
  const whereSql = where(WhereKey.USERNAME, username)
  const passed: boolean = await _validate(password, whereSql)
  if (!passed) throw '账号或密码错误'

  await _updateOnline(true, whereSql)
}

export async function signOut(userId: number) {
  await _updateOnline(false, where(WhereKey.USER_ID, userId))
}

export function findById(userId: number) {
  return _find(where(WhereKey.USER_ID, userId))
}

export function findByName(username: string) {
  return _find(where(WhereKey.USERNAME, username))
}

export async function setProfile(userId: number, profile: Profile) {
  const sql = /*sql*/ `
    UPDATE user SET
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
