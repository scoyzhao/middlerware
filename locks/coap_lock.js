/*
 * @Author: scoyzhao
 * @Date: 2018-04-11 15:34:10
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-24 22:08:38
 */

const deviceInfo = {
    status: 0,
    IMEI: 'coap1',
    deviceState: 1,
}

const coap = require('coap'),
    req = coap.request({
        pathname: `coap/${deviceInfo.IMEI}/${deviceInfo.deviceState}`,
        observe: true,
    })

req.on('response', function (res) {
    res.on('data', function (data) {
        if (data.toString() !== deviceInfo.deviceState) {
            deviceInfo.deviceState = data.toString()
            console.log(`device's state has move to ${deviceInfo.deviceState}`)
        }
    })

})

req.end()
