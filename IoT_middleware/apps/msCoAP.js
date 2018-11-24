/*
 * @Author: scoyzhao
 * @Date: 2018-11-24 20:49:16
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-24 21:23:58
 */

module.exports = function (coapServer, mongoose, Lock, producer) {
    coapServer.on('request', function (req, res) {
        let flag = 0
        //判断是否是Observe请求
        if (req.headers['Observe'] !== 0)
            return res.end(new Date().toISOString() + '\n')

        let interval = setInterval(function () {
            let [, type, IMEI, state] = req.url.split('/')
            let payload = `${type}/${IMEI}/${state}`

            if (flag === 0) {
                // let payload = `${type}/${IMEI}/${state}`
                producer.send([
                    {
                        topic: 'info',
                        messages: payload,
                    }
                ], function (err, data) {
                    console.log(data)
                    flag = 1
                })

            }
            Lock.findOne({ IMEI }, function (err, lock) {
                // console.log(lock.state)
                if (lock.state !== state) {
                    res.write('' + lock.state)
                }
            })
        }, 1000)

        //结束观察模式后触发finish事件
        res.on('finish', function (err) {
            console.log('finsh')
        })

    })

    coapServer.listen(function () {
        console.log('CoAP server is up and running')
    })
}
