import { convertToBoolean } from '../utils'
import Service from '../utils/baseClass/Service'
import { UserSetting } from '../utils/type'
import User from './User'

export default class Setting extends Service {
  private _userId: string
  private _theme: string
  public get theme(): string {
    return this._theme
  }
  public set theme(value: string) {
    this._theme = value
  }
  private _language: string
  public get lang(): string {
    return this._language
  }
  public set lang(value: string) {
    this._language = value
  }
  private _menuExpansion: boolean
  public get menuDefaultExpansion(): boolean {
    return this._menuExpansion
  }
  public set menuDefaultExpansion(value: boolean) {
    this._menuExpansion = value
  }
  private _drawerOpened: boolean
  public get drawerDefaultOpened(): boolean {
    return this._drawerOpened
  }
  public set drawerDefaultOpened(value: boolean) {
    this._drawerOpened = value
  }
  private _useMarkdownGuide: boolean
  public get useMarkdownGuide(): boolean {
    return this._useMarkdownGuide
  }
  public set useMarkdownGuide(value: boolean) {
    this._useMarkdownGuide = value
  }
  public get userId(): string {
    return this._userId
  }
  public set userId(value: string) {
    this._userId = value
  }
  public constructor(userId: string) {
    super()
    this._userId = userId
    this._theme = 'primary'
    this._language = 'zh-CN'
    this._drawerOpened = false
    this._menuExpansion = false
    this._useMarkdownGuide = true
  }

  private _setSetting(setting: UserSetting) {
    if (!setting) return

    this.theme = setting.theme
    this.lang = setting.lang
    this.drawerDefaultOpened = setting.drawerDefaultOpened
    this.menuDefaultExpansion = setting.menuDefaultExpansion
    this.useMarkdownGuide = setting.useMarkdownGuide
  }

  public async get() {
    await User.find({ userId: this.userId })
    const userSetting = await this.dao.setting.find(this.userId)
    if (userSetting) {
      const setting = convertToBoolean(userSetting)
      this._setSetting(setting)
      return setting
    }
  }

  public async add() {
    await User.find({ userId: this.userId })
    await this.dao.setting.add(this.userId)
  }

  public async update(setting: UserSetting) {
    await this._setSetting(setting)
    await this.dao.setting.update(this.userId, setting)
  }
}
