const Mongoose = require('mongoose');
const shortId = require('shortid');
const Schema = Mongoose.Schema;

const PlaylistModel = new Schema({
    shortId: {type: String, unique: true, default: shortId.generate},
    users: [{
        socketId: {type: String, required: true},
        name: {type: String}
    }],
    actualVideo: {type: Number, default: 0},
    videos: [{
        id: {type: String, required: true},
        title: {type: String, required: true},
        thumbnails: {type: String, required: true},
        channel: {type: String, required: true},
        duration: {
            hours: {type: Number, required: true},
            minutes: {type: Number, required: true},
            seconds: {type: Number, required: true}
        }
    }]
});

module.exports = Mongoose.model("Playlist", PlaylistModel);