/* app.js */
const express = require('express');
const app = express();

// socket.io setup
const server = require('http').Server(app);
const io = require('socket.io')(server);
io.on("connection", (socket) => {
  console.log("🔌 New user connected! 🔌");
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

server.listen('3000', () => {
  console.log('Server listening on Port http://localhost:3000');
})
