import { Delegation } from './utils.js'

const context = new Delegation()
  .getter('request', 'url')
  .getter('request', 'method')
  .getter('response', 'status')
  .setter('response', 'status')

export default context
