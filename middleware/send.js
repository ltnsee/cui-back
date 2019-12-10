module.exports = () => {
  let render = ctx => {
    return result => {
      ctx.set("Content-Type", "application/json");
      ctx.body = JSON.stringify({
        code: 1,
        ...result
      });
    }
  }
  let renderError = ctx => {
    return msg => {
      ctx.set("Content-Type", "application/json");
      ctx.body = JSON.stringify({
        code: 0,
        message: msg.toString()
      });
    }
  }
  return async (ctx, next) => {
    ctx.send = render(ctx);
    ctx.sendError = renderError(ctx);
    await next()
  }
}