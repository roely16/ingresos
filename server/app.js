const express = require('express');
var schedule = require('node-schedule');
const request = require('request')

const app = express();

const server = app.listen(3001, function() {
});

const io = require('socket.io')(server);

io.on('connection', function(socket) {
    
    socket.on('SEND_MESSAGE', function(data) {
        io.emit('MESSAGE', data)
    });

});

schedule.scheduleJob('59 59 * * * *', function(){
    
    io.emit('MESSAGE', { "status": false, "data": "" })

    request.post('http://172.23.25.36/apps/api_ingresos/', {
        json: {
            name: 'ingresos',
            param: {}
        }
    }, (error, res, body) => {
        if (error) {
            // console.error(error)
            return
        }
        // console.log(`statusCode: ${res.statusCode}`)
        // console.log(body)

        io.emit('MESSAGE', { "status": true, "data": body })

    })

});