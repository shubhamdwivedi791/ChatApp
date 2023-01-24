//node server which will handle socket io connections

const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });

const users = {};



io.on('connection', socket =>{
    //if any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', Uname =>{
        console.log("New User join", Uname);
        users[socket.id] = Uname;
        socket.broadcast.emit('user-joined', Uname);
    });

    //if someone sends a message, broadcast it to other people 
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    //if someone leaves the chat, let others know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})