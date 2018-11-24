/*
 * @Author: scoyzhao
 * @Date: 2018-11-21 16:11:08
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-24 20:55:28
 */

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
// deal with form
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.raw())

// get config
const config = require('../config.js')
// kafka module
const kafka = require('kafka-node')
const HighLevelProducer = kafka.HighLevelProducer
const client = new kafka.Client(config.KafkaHost)
const producer = new HighLevelProducer(client)

producer.on('ready', function () {
    console.log('kafka connect ready')
})
producer.on('error', function (err) {
    console.log(err)
})

const mqtt = require('mqtt')
const mosca = require('mosca')

const mqttClient = mqtt.connect(config.mqttHost, {
    username: 'sendMessage',
    password: '123456',
})

const coap = require('coap')
const coapServer = coap.createServer()

// for coap
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/IoT_Middleware)', {
    useNewUrlParser: true
})
const Lock = require('../service/models/lock.js')

const loadDir = require('./load_dir.js')
// load apps
const apps = loadDir('./apps')
// execute apps
function parser(fun) {
    return fun.toString()
        .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, '') // remove spaces and comments
        .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1] // get parameter
}
function loadmodule(module) {
    for (const key in module) {
        let parameter = parser(module[key])
        eval('module[key]' + '(' + parameter + ')')
        // eval(`${module[key](parameter)}`)
    }
}
loadmodule(apps)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(3000, () => console.log('IoT_Middleware app listening on port 3000!'))
