/* chat.js */

const sanitizeHtml = require('sanitize-html');

const sanitizeMessageOptions = { allowedTags: [ 'b', 'i', 'em', 'strong'] };
const sanitizeUsernameOptions = {
  allowedTags: [],
  allowedAttributes: {}
};

module.exports = (io, socket, onlineUsers, channels) => {
  socket.on('new user', (username) => {
    username = sanitizeHtml(username.trim(), sanitizeUsernameOptions);
    onlineUsers[username] = socket.id;
    socket["username"] = username;
    channels["General"].push({sender : "", announcement: true, message: `${username} has joined the chat!`});
    io.emit("new user", username);
  });

  socket.on('new message', (data) => {
    data.message = sanitizeHtml(data.message.trim(), sanitizeMessageOptions);
    data.sender = sanitizeHtml(data.sender.trim(), sanitizeUsernameOptions);
    channels[data.channel].push({sender : data.sender, message : data.message});
    io.emit('new message', data);
  });

  socket.on('get online users', () => {
    socket.emit('get online users', onlineUsers);
  });

  socket.on('get all channels', () => {
    socket.emit('get all channels', channels);
  });

  socket.on('user changed channel', (newChannel) => {
    socket.join(newChannel);
    socket.emit('user changed channel', {
      channel : newChannel,
      messages : channels[newChannel]
    });
  });

  socket.on('new channel', (newChannel) => {
    if (!channels[newChannel]) {
      channels[newChannel] = [];
      io.emit('new channel', newChannel);
    }
    socket.join(newChannel);
    socket.emit('user changed channel', {
      channel : newChannel,
      messages : channels[newChannel]
    });
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.username]
    if (socket.username) {
      channels["General"].push({sender : "", announcement: true, message: `${socket.username} has left the chat!`});
      io.emit('user has left', {onlineUsers: onlineUsers, username: socket.username});
    }
  });
}
