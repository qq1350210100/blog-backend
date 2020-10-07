import { EventEmitter } from 'events'
import * as dao from '../../dao'

export default class Service extends EventEmitter {
  dao: typeof dao
  constructor() {
    super()
    this.dao = dao
  }

  static dao = dao
}
