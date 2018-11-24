/*
 * @Author: scoyzhao
 * @Date: 2018-11-22 15:15:21
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-24 14:52:22
 */

const config = require('../config.js')
const kafka = require('kafka-node'),
    HighLevelConsumer = kafka.HighLevelConsumer,
    client = new kafka.Client(config.KafkaHost),
    consumer = new HighLevelConsumer(
        client,
        [
            { topic: 'info' }
        ],
        {
            groupId: 'my-group'
        }
    )

const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// const session = require('express-session')
// const passport = require('./passport.js')
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


// deal with form
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// for saving session in mongodb
app.use(cookieParser())

// Connection to DB, if not configue promise, there will be a warning
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/IoT_Middleware)', {
    useNewUrlParser: true
})

app.use(expressJwt({ secret: 'secret' }).unless({ path: ['/reg', '/login'] }))
app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).send("invalid token")
    }
})

require('./routes.js')(app)

app.get("/test", function (req, res) {
    res.status(200).json({
        message: req.user.username
    });
})

// 404 page
app.use(function (req, res) {
    // res.type('text/plain');
    res.status(404)
})

// 500 page
app.use(function (req, res, next) {
    console.error(err.stack)
})

const Lock = require('./models/lock.js')
consumer.on('message', function (message) {
    if (message.value !== 'changeState') {
        let [type, IMEI, state] = message.value.split('/')

        Lock.updateOne({ IMEI }, {
            // type: req.body.type,
            state,
            // owner: req.body.owner,
        }, function (err, lock) {
            if (err) {
                console.log(err)
                return
            }
            console.log(`${IMEI}'s state has synced`)
        })
    }
})

app.listen(4000, () => console.log('Server listening on port 4000!'))
