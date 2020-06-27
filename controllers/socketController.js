'use strict';

const addUserToPlaylist = require('../actions/addUserToPlaylist');
const removeUserToPlaylist = require('../actions/removeUserToPlaylist');

module.exports = function (io) {
    io.on('connection', (socket) => {
        io.to(socket.id).emit('confirm connection', { message: "Successfull connection to Websocket !", socketId: socket.id });

        socket.on('disconnect', async data => {
            try {
                const res = await removeUserToPlaylist(socket.id);
                socket.leave(res.doc.shortId);
                if (res.removed.length > 0)
                    io.to(res.doc.shortId).emit('newLeave', { name: res.removed.name, socketId: socket.id});
            } catch (err) {
                if (err != 'not found')
                    console.error(err);
            }
        })

        socket.on('joinPlaylist', (data, answer) => {
            if (typeof data === 'string')
                data = JSON.parse(data);
            
            addUserToPlaylist(data.playlistId, socket.id, data.name).then(_ => {
                answer({message: 'ok'});
                socket.join(data.playlistId);
                io.to(data.playlistId).emit('newJoin', { name: data.name, socketId: socket.id });
            }, err => {
                if (err == 'not found') {
                    answer({message: 'not found'});
                } else {
                    answer({message: 'ko'});
                }
            })
        })

        socket.on('leavePlaylist', async data => {
            try {
                const res = await removeUserToPlaylist(socket.id);
                socket.leave(res.doc.shortId);
                if (res.removed.length > 0)
                    io.to(res.doc.shortId).emit('newLeave', { name: res.removed.name, socketId: socket.id});
            } catch (err) {
                if (err != 'not found')
                    console.error(err);
            }
        })

        socket.on('nextVideo', data => {
            if (typeof data === 'string')
                data = JSON.parse(data);
            
            
        })
    })
};