const PlaylistService = require('../service/playlistService');

module.exports = (shortid, socket, username) => {
    return new Promise(async (resolve, reject) => {
        try {
            const playlist = await PlaylistService.findPlaylistByShortId(shortid);
        } catch(err) {
            reject(err);
        }

        const user = {
            socketId: socket,
            name: username
        };

        playlist.users.push(user);
        playlist.save((err, doc) => {
            if (err)
                reject(err);
            resolve(doc);
        })
    })
}