const router = require('koa-router')()
const app = require('../app')
const User = require('../database/models/users')

// router.prefix('/user')

const getUsers = async (ctx, next) => {
  console.log('ctx', JSON.stringify(ctx), ctx.secret)
  try {
    const result = await User.find()
    ctx.send({ data: result });
  } catch (err) {
    ctx.throw(e);
    return ctx.sendError(e)
  }
}

const getUserByUserId = async (ctx, next) => {
  const userId = ctx.params.userId
  try {
    const result = await User.findById(userId)
    ctx.send({ data: result });
  } catch (err) {
    ctx.throw(e);
    return ctx.sendError(e)
  }
}

const addUser = async (ctx, next) => {
  const user = ctx.request.body
  try {
    const result = await User.create(user)
    ctx.send({
      data: result,
      message: '添加用户成功'
    });
  } catch (err) {
    ctx.throw(e);
    return ctx.sendError(e)
  }
}

router.get('/', getUsers)
router.get('/:userId', getUserByUserId)
router.post('/', addUser)

module.exports = router
