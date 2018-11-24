/*
 * @Author: scoyzhao
 * @Date: 2018-11-22 14:07:18
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-22 21:03:59
 */

module.exports = function (app, express, mqttClient) {
    const router = express.Router()
    // change lock's state
    router.post('/changeState', function(req, res) {
        let topic = req.body.IMEI
        if (mqttClient.publish(topic, 'changeState')) {
            res.json({
                message: `change ${topic}'s state`
            })
        }
    })
    router.get('/changePassword', function (req, res) {
        if (mqttClient.publish('mqtt', 'changePassword')) {
            res.json({
                message: `change mqtts password`
            })
        }
    })

    app.use('/mqtt', router)
}
