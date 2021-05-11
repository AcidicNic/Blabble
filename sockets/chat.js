/* chat.js */

const sanitizeHtml = require('sanitize-html');

const sanitizeMessageOptions = { allowedTags: [ 'b', 'i', 'em', 'strong'] };
const sanitizeUsernameOptions = {
  allowedTags: [],
  allowedAttributes: {}
};

module.exports = (io, socket, onlineUsers) => {
  // Listen for "new user" socket emits
  socket.on('new user', (username) => {
    username = sanitizeHtml(username.trim(), sanitizeUsernameOptions);
    onlineUsers[username] = socket.id;
    socket["username"] = username;
    console.log(`✋ ${username} has joined the chat! ✋`);
    // Send the username to all clients currently connected
    io.emit("new user", username);
  });

  socket.on('new message', (data) => {
    // Send that data back to ALL clients
    data.message = sanitizeHtml(data.message.trim(), sanitizeMessageOptions);
    data.sender = sanitizeHtml(data.sender.trim(), sanitizeUsernameOptions);
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
    io.emit('new message', data);
  });

  socket.on('get online users', () => {
    // Send over the onlineUsers
    socket.emit('get online users', onlineUsers);
  });

  socket.on('disconnect', () => {
    //This deletes the user by using the username we saved to the socket
    delete onlineUsers[socket.username]
    io.emit('user has left', onlineUsers);
  });
}
