const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000; 

const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
    } 
});

io.on('connection', (socket) => {
    console.log("New connection is up...");
    console.log(socket.id);

    socket.on('joinRoom', (details) => {
        const { name, room } = details;

        socket.join(room); // this line makes the client join the room

        console.log(`User ${name} joined the room ${room}`);

        // in the same room

        socket.on('newMessage', (message) => {
            console.log(`Message is ${message}`);
            io.to(room).emit('newmessageInTheRoom', {user: name, text: message});
        })

    }) /// listener which will be trigger when client reqs for room joining
})


server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});