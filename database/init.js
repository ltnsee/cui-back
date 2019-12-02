const mongoose = require('mongoose')
const db = 'mongodb://127.0.0.1/music'
// mongoose自己实现的Promise与规范的Promise存在差异，在这里使用node.js实现的Promise global 是服务器端的全局对象
mongoose.Promise = global.Promise
exports.connectdb = () => {
  let  maxConnectTimes = 0
  return new Promise((resolve,reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    mongoose.connect(db)
    mongoose.connection.on('disconnect', () => {
      maxConnectTimes ++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('There is something wrong about mongodb')
      }
    })
    mongoose.connection.on('error', () => {
      reject(err)
      console.log(error)
    })
    mongoose.connection.on('open', () => {
      resolve()
      console.log('Mongodb connected successfully')
    })
  })
}