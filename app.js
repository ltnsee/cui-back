const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const static = require('koa-static')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const { connectdb } = require('./database/init')
const routes = require('./routes')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json())
app.use(logger())
app.use(static(__dirname + '/public'))

// app.use(views(__dirname + '/dist', {
//   extension: 'htme'
// }))
// app.use(views(__dirname + '/views', {
//   extension: 'ejs'
// }))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  // console.log(`routes：${JSON.stringify(routes)}`)
});

(async ()=>{
  await connectdb();
})()

// routes
app.use(routes.routes(), routes.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
