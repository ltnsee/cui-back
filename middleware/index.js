const path = require('path')
const json = require('koa-json')
const static = require('koa-static')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const session = require('koa-session');
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

  // 
  app.keys = ['cui']; /*cookie的签名*/
  const sessionConfig = {
    key: 'koa:sess',
    /** 默认 */
    maxAge: 10000,
    /*  cookie的过期时间        【需要修改】  */
    overwrite: true,
    /** (boolean) can overwrite or not (default true)    没有效果，默认 */
    httpOnly: true,
    /**  true表示只有服务器端可以获取cookie */
    signed: true,
    /** 默认 签名 */
    rolling: false,
    /** 在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false） 【需要修改】 */
    renew: false,
    /** (boolean) renew session when session is nearly expired      【需要修改】*/
  };
  app.use(session(sessionConfig, app)); //配置koa-session


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