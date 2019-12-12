const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const User = require('../database/models/users')
const appConfig = require('../config')

// router.prefix('/user')

const login = async (ctx, next) => {
  const params = {
    username: ctx.request.body.username,
    password: ctx.request.body.password
  }
  console.log('params', params)
  try {
    let user = await User.findOne({
      username: params.username
    })
    if (!user) {
      return ctx.sendError('用户名不存在！');
    }
    if (params.password !== user.password) {
      return ctx.sendError('密码错误,请重新输入！');
    }
    // 更新登陆时间
    await User.findByIdAndUpdate(user._id, {
      $set: {
        loginTime: new Date()
      }
    })

    let payload = {
      _id: user._id,
      username: user.username,
      name: user.name
    }
    // token签名 有效期为24小时
    let token = jwt.sign(payload, appConfig.auth.secret, { expiresIn: '24h' })
    // 是否只用于http请求中获取
    ctx.cookies.set(appConfig.auth.tokenKey, token, { httpOnly: false });
    ctx.send({ token, message: '登录成功' });
  } catch (e) {
    if (e === '暂无数据') {
      return ctx.sendError('用户名不存在');
    }
    ctx.throw(e);
    return ctx.sendError(e)
  }
}

router.post('/', login)

module.exports = router