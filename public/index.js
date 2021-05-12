/* index.js */

$(document).ready(() => {

  const socket = io.connect();
  let currentUser;

  socket.emit('get online users');

  $('#create-user-btn').click( (e) => {
    e.preventDefault();

    if($('#username-input').val().length > 0){
      socket.emit('new user', $('#username-input').val());
      currentUser = $('#username-input').val();
      $('.main-container').css('display', 'flex');
      $('.username-form').remove();
    }
  });

  $('#send-chat-btn').click( (e) => {
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

  $('#leave-chat-btn').click( (e) => {
    e.preventDefault();
    window.location.reload(true);
  });

  $('#new-channel-btn').click( () => {
    let newChannel = $('#new-channel-input').val();

    if(newChannel.length > 0){
      // Emit the new channel to the server
      socket.emit('new channel', newChannel);
      $('#new-channel-input').val("");
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
  socket.on('user has left', (data) => {
    $('.users-online').empty();
    for(username in data.onlineUsers){
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    }
    $('.message-container').append(`
      <div class="message">
        <p class="message-announcement">${data.username} has left the chat!</p>
      </div>
    `);
  });

  socket.on('new user', (username) => {
    $('.message-container').append(`
      <div class="message">
        <p class="message-announcement">${username} has joined the chat!</p>
      </div>
    `);
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
