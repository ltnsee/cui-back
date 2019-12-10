const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const User = require('../database/models/users')
const appConfig = require('../config')

// router.prefix('/user')

const info = async (ctx, next) => {
  let token = ctx.request.query.token;
  try {
    let tokenInfo = jwt.verify(token, conf.auth.secret);
    console.log(tokenInfo)
    ctx.send({ data: tokenInfo })
  } catch (e) {
    if ('TokenExpiredError' === e.name) {
      ctx.sendError('鉴权失败, 请重新登录!');
      ctx.throw(401, 'token expired,请及时本地保存数据！');
    }
    ctx.throw(401, 'invalid token');
    ctx.sendError('系统异常!');
  }
}

router.get('/', info)

module.exports = router