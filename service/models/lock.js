/*
 * @Author: scoyzhao
 * @Date: 2018-11-22 15:30:01
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-22 15:53:38
 */

const mongoose = require('mongoose')
const lockSchema = mongoose.Schema({
    type: String,
    IMEI: String,
    state: Number,
    owner: String,
})

const Lock = mongoose.model('Lock', lockSchema, 'Lock')
module.exports = Lock