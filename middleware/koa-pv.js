function pv (ctx) {
  global.console.log('当前路由', ctx.path)
}

module.exports = function () {
  return async function(ctx, next) {
    pv(ctx)
    await next()
  }
}