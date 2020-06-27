const Playlist = require('../models/playlistModel');
const { resolve } = require('bluebird');

class PlaylistService {

    ytVidToVid(ytVideo) {
        const video = {
            id: ytVideo.id,
            title: ytVideo.snippet.title,
            description: ytVideo.snippet.description,
            thumbnails: ytVideo.snippet.thumbnails.default.url,
            channel: ytVideo.snippet.channelTitle,
            duration: null
        };
        var ytTime = ytVideo.contentDetails.duration;

        if (!ytTime || !ytTime.startsWith("PT"))
            return video;
        ytTime = ytTime.substring(2);

        const duration = {
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        const hIndex = ytTime.indexOf('H');
        if (hIndex != -1) {
            let hStr = ytTime.substring(0, hIndex);
            ytTime = ytTime.substring(hIndex + 1);

            if (hStr.length > 0 && parseInt(hStr, 10) != NaN)
                duration.hours = parseInt(hStr, 10);
        }

        const mIndex = ytTime.indexOf('M');
        if (mIndex != -1) {
            let mStr = ytTime.substring(0, mIndex);
            ytTime = ytTime.substring(mIndex + 1);

            if (mStr.length > 0 && parseInt(mStr, 10) != NaN)
                duration.minutes = parseInt(mStr, 10);
        }

        const sIndex = ytTime.indexOf('S');
        if (sIndex != -1) {
            let sStr = ytTime.substring(0, sIndex);
            ytTime = ytTime.substring(sIndex + 1);

            if (sStr.length > 0 && parseInt(sStr, 10) != NaN)
                duration.seconds = parseInt(sStr, 10);
        }

        video.duration = duration;
        return video;
    }

    createPlaylist() {
        return new Promise((resolve, reject) => {
            const playlist = new Playlist();

            playlist.save().then(playlist => resolve(playlist), err => reject(err));
        })
    }

    deletePlaylist(playlistId) {
        return new Promise((resolve, reject) => {
            Playlist.findByIdAndDelete(playlistId, (err, doc) => {
                if (err)
                    reject(err);
                if (doc == null)
                    reject('not found');
                resolve(doc);
            })
        })
    }

    findPlaylistById(id) {
        return new Promise((resolve, reject) => {
            Playlist.findById(id, (err, doc) => {
                if (err)
                    reject(err);
                if (doc == null)
                    reject('not found');
                resolve(doc);
            })
        })
    }

    findPlaylistByShortId(shortId) {
        return new Promise((resolve, reject) => {
            Playlist.findOne({shortId}, (err, doc) => {
                if (err)
                    reject(err);
                if (doc == null)
                    reject('not found');
                resolve(doc);
            })
        })
    }

    findPlaylistBySocket(socket) {
        return new Promise((resolve, reject) => {
            Playlist.findOne({'users.socketId': socket}, (err, doc) => {
                if (err)
                    reject(err);
                if (doc == null)
                    reject('not found');
                resolve(doc);
            })
        })
    }

}

module.exports = new PlaylistService();