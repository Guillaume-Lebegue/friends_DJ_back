const { google } = require('googleapis');
const url = require('url');

class YoutubeService {

    getVideoIdFromUrl(url) {
        const urlObject = new URL(url);
        const searchParams = urlObject.searchParams;

        return searchParams.get('v');
    }

    getVideo(videoId) {
        return new Promise((resolve, reject) => {
            const service = google.youtube('v3');
            service.videos.list({
                auth: process.env.YOUTUBEAPIKEY,
                part: 'snippet,contentDetails',
                id: videoId
            }, (err, response) => {
                if (err) {
                    console.log('Youtube Api returned an error: ' + err);
                    reject(err);
                    return;
                }
                const video = response.data.items;
                if (video.length == 0)
                    resolve(null);
                else
                    resolve(video[0]);
            });
        })
    }

}

module.exports = new YoutubeService();