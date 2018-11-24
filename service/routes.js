/*
 * @Author: scoyzhao
 * @Date: 2018-11-22 15:37:06
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-24 15:07:36
 */

const lockController = require('./controllers/lockController.js')
const authController = require('./controllers/authController.js')

module.exports = function (app) {
    app.get('/', (req, res) => res.send('Hello World!'))

    app.post('/reg', authController.reg)
    app.post('/login', authController.login)

    app.post('/createLock', lockController.create)
    app.post('/changeLockState', lockController.change)
    app.post('/getOwner', lockController.getOwner)
}
