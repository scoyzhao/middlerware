/*
 * @Author: scoyzhao
 * @Date: 2018-11-22 15:23:08
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-23 15:17:23
 */

const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    username: String,
    phoneNumber: String,
    password: String,
})

const User = mongoose.model('User', UserSchema, 'User')
module.exports = User
