/* app.js */
require('dotenv').config();
const port = process.env.PORT || 666;
const env = process.env.ENV || 'DEV';

const express = require('express');
const app = express();

// socket.io setup
const server = require('http').Server(app);
const io = require('socket.io')(server);
let onlineUsers = {};
let channels = {"General": []};
io.on("connection", (socket) => {
  require('./sockets/chat.js')(io, socket, onlineUsers, channels);
})

// express-handlebars setup
const exphbs  = require('express-handlebars');
app.engine('hbs', exphbs({
  extname: '.hbs',
  layoutsDir: __dirname + '/views',
  defaultLayout: 'base'
}));
app.set('view engine', 'hbs');

// static folder setup
app.use('/public', express.static('public'))

// routes
app.get('/', (req, res) => {
  res.render('index.hbs');
})

server.listen(port, () => {
  if (env === 'DEV') {
    console.log(`Server listening on http://localhost:${port}`);
  } else {
    console.log(`Server listening on http://blab.nicc.io/`);
  }
})
