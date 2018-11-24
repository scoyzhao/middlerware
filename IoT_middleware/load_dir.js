/*
 * @Author: scoyzhao
 * @Date: 2018-11-21 16:34:16
 * @Last Modified by:   scoyzhao
 * @Last Modified time: 2018-11-21 16:34:16
 */

/**
 * 基于文件夹加载所需的微服务包
 */

const fs = require('fs')
const path = require('path')

const load = (path, name) => {
    if (name) {
        return require(path + name)
    }

    return require(path)
}

module.exports = (dir) => {
    const patcher = {}

    fs.readdirSync(__dirname + '/' + dir).forEach(filename => {
        if (!/\.js$/.test(filename)) {
            return
        }

        let name = path.basename(filename, '.js')
        let _load = load.bind(null, './' + dir + '/', name)

        patcher.__defineGetter__(name, _load)
    })

    return patcher
}