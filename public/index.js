/* index.js */

$(document).ready(() => {

  const socket = io.connect();
  let currentUser;

  socket.emit('get online users');

  $(document).on('click', '.channel', (e)=>{
    let newChannel = e.target.textContent;
    socket.emit('user changed channel', newChannel);
  });

  $('#create-user-btn').click( (e) => {
    e.preventDefault();

    if($('#username-input').val().length > 0){
      socket.emit('new user', $('#username-input').val());
      socket.emit('get all channels');
      socket.emit('user changed channel', "General");
      currentUser = $('#username-input').val();
      $('.main-container').css('display', 'flex');
      $('.username-form').remove();
    }
  });

  $('#send-chat-btn').click( (e) => {
    e.preventDefault();
    let channel = $('.channel-current').text();
    let message = $('#chat-input').val();
    if (message.length > 0){
      socket.emit('new message', {
        sender: currentUser,
        message: message,
        channel : channel
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

  socket.on('user has left', (data) => {
    $('.users-online').empty();
    for(username in data.onlineUsers){
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    }
  });

  socket.on('new user', (username) => {
    $('.users-online').append(`<div class="user-online">${username}</div>`);
  });

  socket.on('new message', (data) => {
    let currentChannel = $('.channel-current').text();
    if (currentChannel == data.channel) {
      $('.message-container').append(`
        <div class="message">
          <p class="message-user">${data.sender}: </p>
          <p class="message-text">${data.message}</p>
        </div>
      `);
    }
  });

  socket.on('new channel', (newChannel) => {
    $('.channels').append(`<div class="channel">${newChannel}</div>`);
  });

  socket.on('user changed channel', (data) => {
    $('.channel-current').addClass('channel');
    $('.channel-current').removeClass('channel-current');
    $(`.channel:contains('${data.channel}')`).addClass('channel-current');
    $('.channel-current').removeClass('channel');
    $('.message').remove();
    data.messages.forEach( (message) => {
      if (message.announcement) {
        $('.message-container').append(`
          <div class="message">
            <p class="message-announcement">${message.message}</p>
          </div>
        `);
      } else {
        $('.message-container').append(`
          <div class="message">
            <p class="message-user">${message.sender}: </p>
            <p class="message-text">${message.message}</p>
          </div>
        `);
      }
    });
  });

  socket.on('get all channels', (channels) => {
    for (channel in channels) {
      if (channel !== "General") {
        $('.channels').append(`<div class="channel">${channel}</div>`);
      }
    }
  });

});
