const router = require('koa-router')()
const User = require('../database/models/users')

// router.prefix('/user')

const register = async (ctx, next) => {
  const params = {
    username: ctx.request.body.username,
    password: ctx.request.body.password
  }
  try {
    const result = await User.create(params)
    ctx.send({
      data: result,
      message: '注册成功'
    });
  } catch (err) {
    ctx.throw(e);
    return ctx.sendError(e)
  }
}

router.get('/', register)

module.exports = router
