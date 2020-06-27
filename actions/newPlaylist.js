const PlaylistService = require('../service/playlistService');

module.exports = async (res) => {
    try {
        const playlist = await PlaylistService.createPlaylist();
        res.status(200).send(playlist);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}