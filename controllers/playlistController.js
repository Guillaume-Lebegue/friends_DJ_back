const newPlaylist = require('../actions/newPlaylist');
const getPlaylist = require('../actions/getPlaylist');

exports.newPlaylistAction = (req, res) => {
    newPlaylist(res);
    return;
}

exports.getPlaylistAction = (req, res) => {
    const { shortId } = req.params;
    getPlaylist(shortId, res);
    return;
}