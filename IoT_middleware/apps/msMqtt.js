/*
 * @Author: scoyzhao
 * @Date: 2018-11-21 16:28:55
 * @Last Modified by: scoyzhao
 * @Last Modified time: 2018-11-24 21:03:38
 */

module.exports = function (mqtt, mosca, config, producer) {
    const settings = {
        port: 1883,
    }
    const authenticate = function (client, username, password, callback) {
        let authorized = (password.toString() === '123456')

        if (authorized) {
            client.user = username
        }
        callback(null, authorized)
    }

    const server = new mosca.Server(settings)

    server.on('clientConnected', function (client) {
        console.log('client connected', client.id);
    });

    // fired when a message is received
    server.on('published', function (packet, client) {
        // console.log('Published', packet.topic.toString(), packet.payload.toString());
        if (packet.topic.toString().match(/mqtt\d+/)) {
            producer.send([
                {
                    topic: 'info',
                    messages: packet.payload.toString(),
                }
            ], function (err, data) {
                console.log(data)
            })
        }
        // console.log(packet.payload.toString())
    });

    server.on('ready', setup);

    // fired when the mqtt server is ready
    function setup() {
        server.authenticate = authenticate
        console.log('Mosca server is up and running');
    }
}
