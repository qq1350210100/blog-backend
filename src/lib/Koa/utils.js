// redux-compose
export function compose(...fns) {
  if (fns.length == 0) return arg => arg
  if (fns.length == 1) return fns[0]
  return fns.reduce((acc, cur) => (...args) => acc(cur(...args)))
}

// koa-compose
export function koaCompose(...middlewares) {
  return ctx => {
    let count = 0
    function dispatch(i) {
      if (count > i) throw new Error('next() 在中间件中被调用超过1次')
      count = i + 1
      const fn = i < middlewares.length && middlewares[i]
      if (!fn) return Promise.resolve()
      try {
        const next = () => dispatch(i + 1)
        return Promise.resolve(fn(ctx, next))
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}

// 对象属性委托
export class Delegation {
  public constructor(opts = {}) {
    this.opts = opts
  }

  getter(name, prop) {
    Reflect.defineProperty(this, prop, {
      ...this.opts,
      // 当 object 只存在 get 时，enumerable 和 configurable 默认为 false，需要改成 true
      enumerable: true,
      configurable: true,
      get() {
        return Reflect.get(this[name], prop)
      }
    })
    return this
  }

  setter(name, prop) {
    Reflect.defineProperty(this, prop, {
      ...this.opts,
      // 同上
      enumerable: true,
      configurable: true,
      set(value) {
        return Reflect.set(this[name], prop, value)
      }
    })
    return this
  }
}
