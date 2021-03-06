'use strict';

const YoutubeService = require('../service/youtubeService');
const playlistService = require('../service/playlistService');

const addUserToPlaylist = require('../actions/addUserToPlaylist');
const removeUserToPlaylist = require('../actions/removeUserToPlaylist');

module.exports = (io) => {
    io.on('connection', (socket) => {
        io.to(socket.id).emit('confirm connection', { message: "Successfull connection to Websocket !", socketId: socket.id });

        socket.on('disconnect', async data => {
            try {
                const res = await removeUserToPlaylist(socket.id);
                socket.leave(res.doc.shortId);
                if (res.removed != null)
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
                if (res.removed != null)
                    io.to(res.doc.shortId).emit('newLeave', { name: res.removed.name, socketId: socket.id});
            } catch (err) {
                if (err != 'not found')
                    console.error(err);
            }
        })

        socket.on('addVideo', async (data, answer) => {
            if (typeof data === 'string')
                data = JSON.parse(data);
            
            try {
                const playlist = await playlistService.findPlaylistBySocket(socket.id);
                const token = YoutubeService.getVideoIdFromUrl(data.url);
                if (token == null) {
                    answer({message: 'not found'});
                    return;
                }

                const ytvideo = await YoutubeService.getVideo(token);
                const video = playlistService.ytVidToVid(ytvideo);
                if (video == null) {
                    answer({message: 'not found'});
                    return;
                }

                playlist.videos.push(video);
                playlist.save((err, doc) => {
                    if (err) {
                        console.error(error);
                        answer({message: 'ko'});
                    } else {
                        answer({message: 'ok'});
                        io.to(playlist.shortId).emit('newVideo', {video, senderId: socket.id});
                    }
                })
            } catch (error) {
                console.error(error);
                answer({message: 'ko'});
                return;
            }
        })

        socket.on('nextVideo', async data => {
            if (typeof data === 'string')
                data = JSON.parse(data);
            
            try {
                const playlist = await playlistService.findPlaylistBySocket(socket.id);
                playlist.actualVideo = playlist.actualVideo > parseInt(data.passed, 10)
                    ? playlist.actualVideo : parseInt(data.passed, 10) + 1;
                playlist.save((err, doc) => {
                    if (err)
                        console.log(err);
                })
            } catch (error) {
                if (error != 'not found')
                    console.log(error);
            }
        })

        socket.on('sendMessage', async data => {
            if (typeof data === 'string')
                data = JSON.parse(data);

            try {
                const playlist = await playlistService.findPlaylistBySocket(socket.id);
                io.to(playlist.shortId).emit('newMessage', {message: data.message, senderId: socket.id});
            } catch (error) {
                console.error(error);
            }
        })
    })
};