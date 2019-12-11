const path = require('path')
const json = require('koa-json')
const static = require('koa-static')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const send = require('./send')
const auth = require('./auth')

module.exports = app => {
  // error handler
  onerror(app)

  //缓存拦截器
  app.use(async (ctx, next) => {
    if (ctx.url == '/favicon.ico') return

    await next()
    ctx.status = 200
    ctx.set('Cache-Control', 'must-revalidation')
    if (ctx.fresh) {
      ctx.status = 304
      return
    }
  })

  // 数据返回的封装
  app.use(send())

  //权限中间件
  app.use(auth())

  //post请求中间件
  app.use(bodyparser())
  app.use(json())
  app.use(logger())

  //静态文件中间件
  app.use(static(__dirname + '/public'))

  // logger
  app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  });

  // 增加错误的监听处理
  app.on("error", (err, ctx) => {
    if (ctx && !ctx.headerSent && ctx.status < 500) {
      ctx.status = 500
    }
    if (ctx && ctx.log && ctx.log.error) {
      if (!ctx.state.logged) {
        ctx.log.error(err.stack)
      }
    }
  })

}