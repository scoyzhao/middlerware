/*
 * @Author: scoyzhao
 * @Date: 2018-11-23 15:00:24
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-24 14:59:53
 */

// const bcrypt = require('bcrypt')
// const passport = require('../passport.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

module.exports = {
    reg: function (req, res, next) {
        let username = req.body.username
        let password = req.body.password
        let phoneNumber = req.body.phoneNumber
        console.log(req)
        if (!username) {
            return res.status(400).send('username require')
        }
        if (!password) {
            return res.status(400).send('password require')
        }
        if (!phoneNumber) {
            return res.status(400).send('phoneNumber require')
        }
        User.findOne({ username }, function (err, user) {
            if (user) {
                return res.json({
                    message: 'user has existed'
                })
            }

            // let salt = bcrypt.genSaltSync(bcryptSalt)
            // let hashPass = bcrypt.hashSync(req.body.password, salt)

            let newUser = User({
                username,
                password,
                phoneNumber,
            })
            // console.log(newUser)
            newUser.save(function (err) {
                res.json({
                    message: 'reg success'
                })
            })
        })
    },

    login: function(req, res, next) {
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err || user.password !== req.body.password) {
                return res.json({
                    message: 'sth wrong'
                })
            }
            let authToken = jwt.sign({ username: req.body.username }, 'secret')
            res.status(200).json({
                token: authToken,
            })
        })
    }
}
