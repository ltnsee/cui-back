const Koa = require('koa')
const app = new Koa()
const middleware = require('./middleware')
const { connectdb } = require('./database/init')
const routes = require('./routes')

// middlewares
middleware(app)

// mongoose
connectdb()

// routes
routes(app)

module.exports = app
