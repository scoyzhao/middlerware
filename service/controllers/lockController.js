/*
 * @Author: scoyzhao
 * @Date: 2018-11-22 15:39:30
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-24 15:04:28
 */

const Lock = require('../models/lock.js')
const config = require('../../config.js')
const axios = require('axios')

module.exports = {
    create: function (req, res) {
        // 创建锁
        let newLock = new Lock({
            IMEI: req.body.IMEI,
            type: req.body.type,
            state: req.body.state,
            owner: '',
        })

        newLock.save(function (err) {
            if (err) {
                console.log(err)
                return
            }

            return res.json({
                message: 'save new lock'
            })
        })
    },

    getOwner: function (req, res) {
        let owner = req.body.username || req.user.username
        let IMEI = req.body.IMEI

        Lock.updateOne({ IMEI }, {
            owner
        }, function (err) {
            if (err) {
                console.log(err)
                return
            }
            return res.status(200).json({
                message: `lock:${IMEI} get owner ${owner}`
            })
        })
    },

    change: function (req, res) {
        Lock.findOne({ IMEI: req.body.IMEI }, function (err, lock) {
            if (err) {
                console.log(err)
                return
            }

            lock.state = (lock.state === 1)? 0: 1
            Lock.updateOne({ IMEI: req.body.IMEI }, {
                // type: req.body.type,
                state: lock.state,
                // owner: req.body.owner,
            }, function (err, lock) {
                if (err) {
                    console.log(err)
                    return
                }
                // 调用中间件的api
                axios
                    .post(config.middlewareHost + '/mqtt/changeState', {
                        IMEI: req.body.IMEI,
                    })
                    .then(function () {
                        return res.json({
                            message: `${req.body.IMEI}'s state has reversed`
                        })
                    })
                    .catch(function (err) {
                        console.log(err)
                    })

            })
        })
    }
}
