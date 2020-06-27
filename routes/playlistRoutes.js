const express = require('express');
const router = express.Router();

const PlaylistController = require('../controllers/playlistController');

router.route('/')
    .post(PlaylistController.newPlaylistAction);

router.route('/:shortId')
    .get(PlaylistController.getPlaylistAction);

module.exports = router;