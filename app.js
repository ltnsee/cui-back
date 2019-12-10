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
app.use(routes.routes(), routes.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
