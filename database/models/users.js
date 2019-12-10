const mongoose = require('mongoose')

// 创建数据表模型，该文件的名字，即user，就是数据表的名字
// 下面给 user 表声明两个字段name和age

let userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    age: Number,
    avatar: String,
    roles: Array,
    createTime: { type: Date, default: Date.now},
    loginTime: Date
})

// 通过建 model 给 user 赋予增删改查等读写的功能
module.exports = mongoose.model('User', userSchema)