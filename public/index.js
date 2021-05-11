/* index.js */

$(document).ready(() => {

  const socket = io.connect();
  let currentUser;

  socket.emit('get online users');

  $('#create-user-btn').click((e) => {
    e.preventDefault();
    if($('#username-input').val().length > 0){
      socket.emit('new user', $('#username-input').val());
      currentUser = $('#username-input').val()
      $('.username-form').remove();
      $('.main-container').css('display', 'flex');
    }
  });

  $('#send-chat-btn').click((e) => {
    console.log('anyone there??');
    e.preventDefault();
    let message = $('#chat-input').val();
    if(message.length > 0){
      socket.emit('new message', {
        sender: currentUser,
        message: message
      });
      $('#chat-input').val("");
    }
  });

  // socket listeners
  socket.on('get online users', (onlineUsers) => {
    //You may have not have seen this for loop before. It's syntax is for(key in obj)
    //Our usernames are keys in the object of onlineUsers.
    for(username in onlineUsers){
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    }
  });

  //Refresh the online user list
  socket.on('user has left', (onlineUsers) => {
    $('.users-online').empty();
    for(username in onlineUsers){
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    }
  });

  socket.on('new user', (username) => {
    $('.users-online').append(`<div class="user-online">${username}</div>`);
  });

  socket.on('new message', (data) => {
    $('.message-container').append(`
      <div class="message">
        <p class="message-user">${data.sender}: </p>
        <p class="message-text">${data.message}</p>
      </div>
  `);
  });

})
