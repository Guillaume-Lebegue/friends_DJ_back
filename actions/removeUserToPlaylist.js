const PlaylistService = require('../service/playlistService');
const shortid = require('shortid');
const { remove } = require('../models/playlistModel');

module.exports = (socket) => {
    return new Promise(async (resolve, reject) => {
        let playlist;

        try {
            playlist = await PlaylistService.findPlaylistBySocket(socket);
        } catch (err) {
            reject(err);
            return;
        }

        const removed = playlist.users.filter(user => user.socketId == socket);
        playlist.users = playlist.users.filter(user => user.socketId != socket);
        playlist.save((err, doc) => {
            if (err)
                reject(err);
            resolve({doc, removed: removed[0]});
        })
    })
}