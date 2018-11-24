const axios = require('axios')

axios
    .get('http://localhost:3000/mqtt/changePassword')
    .then(() => {
        console.log('test')
    })
    .catch((err) => {
        console.log(err)
    })