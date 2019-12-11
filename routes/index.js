const router = require('koa-router')()
const fs = require('fs')
const path = require('path')

// 获取当前目录下的所有文件名称的数组对象
const files = fs.readdirSync(__dirname)

files
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => {
    const file_name = file.substr(0, file.length - 3);
    const file_entity = require(path.join(__dirname, file));
    if (file_name !== 'index') {
      router.use(`/${file_name}`, file_entity.routes(), file_entity.allowedMethods())
    }
  })

module.exports = app => {
  app.use(router.routes(), router.allowedMethods())
}