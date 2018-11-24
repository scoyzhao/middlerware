/*
 * @Author: scoyzhao
 * @Date: 2018-11-23 14:52:42
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-24 14:59:24
 */

/**
 * 使用了express-jwt，这个文件暂时没有使用
 */

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('./models/user.js')

// serializeUser 用户登录验证成功以后将会把用户的数据存储到 session 中
passport.serializeUser(function(user, done) {
    done(null, user)
})

// deserializeUser 每次请求的时将从 session 中读取用户对象，并将其封装到 req.user
passport.deserializeUser(function(user, done) {
    return done(null, user)
})

passport.use(new LocalStrategy(
    function (phoneNumber, password, done) {
        User.findOne({ phoneNumber }, function(err, user) {
            if (err) {
                return next(err)
            }
            if (!user) {
                return done(null, false)
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false)
            }
            return done(null, user)
        })
    }
))

module.exports = passport
