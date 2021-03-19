import { localConfig, remoteConfig } from '../config'
import { Mysql } from '../libs/crud/database'
import { Query } from '../libs/crud/query'

export const db = new Mysql(localConfig)
export const query = (): Query => new Query(db)
