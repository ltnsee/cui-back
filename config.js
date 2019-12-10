const path = require('path')
const auth = {
  secret: 'admin-token',
  tokenKey: 'Token-Auth',
}

module.exports = {
  auth,
  mongodb: {
    username: 'cd',
    pwd: 123456,
    address: 'localhost:27017',
    db: 'test'
  }
}