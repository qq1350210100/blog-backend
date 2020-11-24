import { db } from '../utils/mysql'
import { throwSqlError } from './util'
import { UserSetting } from '../utils/type'

export async function add(userId: string) {
  const sql = /*sql*/ `INSERT INTO setting SET user_id = "${userId}";`
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function update(userId: string, setting: UserSetting) {
  const sql = /*sql*/ `
    UPDATE setting SET
      drawer_default_opened = ${setting.drawerDefaultOpened},
      use_markdown_guide = ${setting.useMarkdownGuide},
      lang = "${setting.lang}",
      theme = "${setting.theme}"
      WHERE user_id = "${userId}";
  `
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function find(userId: string) {
  const sql = /*sql*/ `
    SELECT 
    drawer_default_opened as drawerDefaultOpened,
    use_markdown_guide as useMarkdownGuide,
    lang as lang,
    theme as theme
    FROM setting WHERE user_id = "${userId}";
  `
  try {
    const results = (await db.query(sql)) as UserSetting[]
    if (!results.length) return
    return results[0]
  } catch (err) {
    throwSqlError(err)
  }
}
