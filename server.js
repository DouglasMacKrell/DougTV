const express = require("express");
const app = express();

// const indexRouter = require('./routes/index');
const broadcastersRouter = require('./routes/broadcast');

// variable to hold the broadcaster's socket id
let broadcaster;

const port = 4004;

const http = require("http");
const server = http.createServer(app);

// socket.io setup
const io = require("socket.io")(server);

var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + "/public"));
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })
app.use('/api/broadcasters', broadcastersRouter);


io.sockets.on("error", e => console.log(e));

// Implement the connection for the clients and broadcaster to the server.
io.sockets.on("connection", socket => {
    socket.on("broadcaster", () => {
        broadcaster = socket.id;
        console.log("broadcaster set", broadcaster)
        socket.emit("broadcaster", broadcaster);
    });
    // socket.on("watcher", () => {
    //     socket.to(broadcaster).emit("watcher", socket.id);
    //     console.log("watcher set", socket.id)
    // });
    // // Code below implements the socket.io events to initialize a WebRTC connection. 
    // // These events will be used by the watchers and broadcaster to 
    // // instantiate a peer-to-peer connection.
    // socket.on("offer", (id, message) => {
    //     socket.to(id).emit("offer", socket.id, message);
    //     console.log("offer sent", message)
    // });
    // socket.on("answer", (id, message) => {
    //     socket.to(id).emit("answer", socket.id, message);
    //     console.log("answer sent")
    // });
    // socket.on("candidate", (id, message) => {
    //     socket.to(id).emit("candidate", socket.id, message);
    //     console.log("candidate", message)
    // });
    // // Stop and close the connection
    // socket.on("disconnect", () => {
    //     socket.to(broadcaster).emit("disconnectPeer", socket.id);
    //     console.log("disconnected")
    // });
    socket.on('new message', data => {
        console.log(data.room);
        socket.broadcast
            .to(data.room)
            .emit('receive message', data)
    });
    socket.on('room', data => {
        console.log('room join');
        console.log(data);
        socket.join(data.room);
    });

    socket.on('leave room', data => {
        console.log('leaving room');
        console.log(data);
        socket.leave(data.room)
    });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = app;