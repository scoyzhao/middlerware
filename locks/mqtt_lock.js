/*
 * @Author: scoyzhao
 * @Date: 2018-11-21 14:37:33
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-22 19:47:53
 */

const mqtt = require('mqtt')
const deviceInfo = {
    IMEI: 'mqtt1',
    username: 'mqtt1',
    password: '123456',
    deviceState: 1,
}

const client = mqtt.connect('mqtt://localhost:1883', {
    username: `${deviceInfo.username}`,
    password: `${deviceInfo.password}`,
})

client.on('connect', () => {
    console.log('>>> connected')
    // 订阅自己的Topic：IMEI
    client.subscribe(`${deviceInfo.IMEI}`)
    client.subscribe('mqtt')
    // 向Topic：info发送信息
    client.publish(`${deviceInfo.IMEI}`, `mqtt/${deviceInfo.IMEI}/${deviceInfo.deviceState}`)
    client.on('offline', () => {
        console.log('>>> close')
    })
})

client.on('message', (topic, message) => {
    if (topic === `${deviceInfo.IMEI}` && message.toString() === 'changeState') {
        deviceInfo.deviceState = (deviceInfo.deviceState === 0)? 1: 0
        console.log(`device's state has move to ${deviceInfo.deviceState}`)
    } else if (topic === 'mqtt' && message.toString() === 'changePassword') {
        console.log('changePassword')
    }
})
