const Path = require('path');
const Mongoose = require('mongoose');
const Express = require('express');
const BodyParser = require('body-parser');
const Morgan = require('morgan');
const Cors = require('cors');
const morgan = require('morgan');

const ENV_FILE = Path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE});

Mongoose.Promise = require('bluebird');
Mongoose.set('debug', process.env.DEBUG == 'TRUE');
Mongoose.connect(process.env.DBURL, {
    promiseLibrary: require('bluebird'),
    useNewUrlParser: true,
    useUnifiedTopology: true
})  .then(_ => console.log('[DB] connection succesfull'))
    .catch(error => console.log(error));

const app = Express();
const port = process.env.port || process.env.PORT || 3000
const server = app.listen(port);
const io = require('socket.io').listen(server);
require('./controllers/socketController')(io);

console.log('[Server] listening on port ', port);

app.use(Cors());
app.use(BodyParser.json({limit: '50mb', extended: true}));
app.use(BodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('dev'));

const PlaylistRoutes = require('./routes/playlistRoutes');

app.use('/api/playlist', PlaylistRoutes);