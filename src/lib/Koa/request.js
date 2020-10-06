const request = {
  get url() {
    return this.req.url
  },
  get method() {
    return this.req.method
  },
  get headers() {
    return this.req.headers
  },
  set url(value) {
    this.req.url = value
  },
  set method(value) {
    this.req.method = value
  },
  set headers(value) {
    this.req.headers = value
  }
}

export default request
