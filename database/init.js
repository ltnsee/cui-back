const mongoose = require('mongoose')
const appConfig = require('../config')
const db = `mongodb://${appConfig.mongodb.address}/${appConfig.mongodb.db}`
// mongoose自己实现的Promise与规范的Promise存在差异，在这里使用node.js实现的Promise global 是服务器端的全局对象
mongoose.Promise = global.Promise

const useMongoClientOption = {
	useNewUrlParser: true,
	useUnifiedTopology: true
}

exports.connectdb = () => {
	let maxConnectTimes = 0
	return new Promise((resolve, reject) => {
		if (process.env.NODE_ENV !== 'production') {
			mongoose.set('debug', true)
		}
		/**
		 * 连接
		 */
		mongoose.connect(db, useMongoClientOption)
    /**
    * 连接成功
    */
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connection open to ' + db);
    });
    /**
     * 断开连接, 自动连接
     */
		mongoose.connection.on('disconnect', () => {
			maxConnectTimes++
			if (maxConnectTimes < 5) {
				mongoose.connect(db, useMongoClientOption)
			} else {
				throw new Error('There is something wrong about mongodb')
			}
		})
		/**
		 * 连接异常
		 */
		mongoose.connection.on('error', () => {
			reject(err)
			console.log(error)
    })
    /**
     * Connection对象发出open事件
     */ 
		mongoose.connection.on('open', () => {
			resolve()
			console.log('Mongodb connected successfully')
		})
	})
}
