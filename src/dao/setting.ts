import { query } from '../utils/mysql'
import { throwSqlError } from './util'
import { UserSetting } from '../utils/type'

export async function create(userId: number): Promise<void> {
  try {
    await query().insertInto('blog.setting').set({ user_id: userId }).end()
  } catch (err) {
    throwSqlError(err)
  }
}

export async function update(userId: number, setting: UserSetting): Promise<void> {
  try {
    await query()
      .update('blog.setting')
      .set({
        drawer_default_opened: setting.drawerDefaultOpened,
        use_markdown_guide: setting.useMarkdownGuide,
        lang: setting.lang,
        theme: setting.theme
      })
      .where()
      .equal('user_id', userId)
      .end()
  } catch (err) {
    throwSqlError(err)
  }
}

export async function find(userId: number): Promise<UserSetting | undefined> {
  try {
    const results: UserSetting[] = await query()
      .select(
        'drawer_default_opened AS drawerDefaultOpened',
        'use_markdown_guide AS useMarkdownGuide',
        'lang',
        'theme'
      )
      .from('blog.setting')
      .where()
      .equal('user_id', userId)
      .end()
    if (!results.length) return
    return results[0]
  } catch (err) {
    throwSqlError(err)
  }
}
