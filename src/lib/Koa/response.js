const response = {
  get status() {
    return this.res.statusCode
  },
  set status(value) {
    this.res.statusCode = value
  }
}

export default response
