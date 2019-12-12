const jwt = require('jsonwebtoken')
const appConfig = require('../config')

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.url == '/login') {
      return next()
    }
    let token = ctx.cookies.get(appConfig.auth.tokenKey);
    console.log('token', token)
    try {
      const secret = await jwt.verify(token, appConfig.auth.secret);
      ctx.secret = secret
      console.log('auth', secret)
    } catch (e) {
      if ('TokenExpiredError' === e.name) {
        ctx.sendError('token已过期, 请重新登录!');
        ctx.throw(401, 'token expired,请及时本地保存数据！');
      }
      ctx.sendError('token验证失败, 请重新登录!');
      ctx.throw(401, 'invalid token');
    }
    console.log("鉴权成功");
    await next();
  }
}