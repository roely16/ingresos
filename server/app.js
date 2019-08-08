const express = require('express');
var schedule = require('node-schedule');
const request = require('request')

const app = express();

const server = app.listen(3001, function() {
    console.log('server running on port 3001');
});


const io = require('socket.io')(server);

io.on('connection', function(socket) {

    console.log(socket.id)

    socket.on('SEND_MESSAGE', function(data) {
        console.log(data)
        io.emit('MESSAGE', data)
    });

});

var j = schedule.scheduleJob('*/30 * * * * *', function(){
    
    io.emit('MESSAGE', { "status": false, "data": "" })

    console.log('mensaje consultando')

    request.post('http://172.23.25.36/apps/api_ingresos/', {
        json: {
            name: 'ingresos',
            param: {
                fecha_inicio: "20190701",
                fecha_fin: "20190731"
            }
        }
    }, (error, res, body) => {
        if (error) {
            // console.error(error)
            return
        }
        // console.log(`statusCode: ${res.statusCode}`)
        // console.log(body)

        io.emit('MESSAGE', { "status": true, "data": body })

        console.log('datos enviados')
    })

});