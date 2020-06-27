'use strict';
const addUserToPlaylist = require('../actions/addUserToPlaylist');

module.exports = function (io) {
    io.on('connection', (socket) => {
        io.to(socket.id).emit('confirm connection', { message: "Successfull connection to Websocket !", socketId: socket.id });

        socket.on('joinPlaylist', (data, answer) => {
            if (typeof data === 'string')
                data = JSON.parse(data);
            
            addUserToPlaylist(data.playlistId, socket.id, data.name).then(_ => {
                answer({message: 'ok'});
                socket.join(data.playlistId);
                io.to(data.playlistId).emit('newJoin', { name: data.name });
            }, err => {
                if (err == 'not found')
                    answer({message: 'not found'});
                else
                    answer({message: 'ko'});
            })
        })

        socket.on('nextVideo', data => {
            if (typeof data === 'string')
                data = JSON.parse(data);
            
            
        })
    })
};