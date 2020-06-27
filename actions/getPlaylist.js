const PlaylistService = require('../service/playlistService');

module.exports = async (shortId, res) => {
    try {
        const playlist = await PlaylistService.findPlaylistByShortId(shortId);
        res.status(200).send(playlist);
    } catch (err) {
        if (err == 'not found')
            res.status(404).send('not found');
        else {
            console.error(err);
            res.status(500).send('error server');
        }
    }
}