import { db } from '../utils/mysql'
import { throwSqlError } from './util'
import { UserSetting } from '../utils/type'

export async function add(userId: number): Promise<void> {
  const sql = /*sql*/ `INSERT INTO blog.setting SET user_id = ${userId};`
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function update(userId: number, setting: UserSetting): Promise<void> {
  const sql = /*sql*/ `
    UPDATE blog.setting SET
      drawer_default_opened = ${setting.drawerDefaultOpened},
      use_markdown_guide = ${setting.useMarkdownGuide},
      lang = "${setting.lang}",
      theme = "${setting.theme}"
      WHERE user_id = ${userId};
  `
  try {
    await db.query(sql)
  } catch (err) {
    throwSqlError(err)
  }
}

export async function find(userId: number): Promise<UserSetting | undefined> {
  const sql = /*sql*/ `
    SELECT 
    drawer_default_opened as drawerDefaultOpened,
    use_markdown_guide as useMarkdownGuide,
    lang as lang,
    theme as theme
    FROM blog.setting WHERE user_id = ${userId};
  `
  try {
    const results = (await db.query(sql)) as UserSetting[]
    if (!results.length) return
    return results[0]
  } catch (err) {
    throwSqlError(err)
  }
}
