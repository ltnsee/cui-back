const router = require('koa-router')()
const app = require('../app')
const User = require('../database/models/users')

// router.prefix('/user')

const getUsers = async (ctx, next) => {
  const result = await User.find()
  ctx.body = {
    result
  }
}

const getUserByUserId = async (ctx, next) => {
  const userId = ctx.params.userId
  const result = await User.findById(userId)
  ctx.body = {
    result
  }
}

const addUser = async (ctx, next) => {
  const user = {
    name: ctx.request.body.name,
    age: ctx.request.body.age
  }
  const result = await User.create(user)
  ctx.body = {
    result
  }
}

router.get('/', getUsers)
router.get('/:userId', getUserByUserId)
router.post('/', addUser)

module.exports = router
