const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const logger = require("morgan");

var cors = require("cors");
app.use(cors());

const broadcastersRouter = require("./routes/broadcast");

const port = Number(process.env.PORT) || 4004;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, { origins: "*:*" });

var bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(logger("dev"));

app.use(express.static(__dirname + "/client/build"));

app.get("/api", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});
app.use("/api/broadcasters", broadcastersRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build", "index.html"));
});

io.sockets.on("error", (e) => console.log(e));

io.sockets.on("connection", (socket) => {
  socket.on("broadcaster", (id) => {
    broadcaster = id;
    console.log("broadcaster set", broadcaster);
    socket.emit("broadcaster", broadcaster);
  });
  socket.on("watcher", (broadcasterId) => {
    socket.to(broadcasterId).emit("watcher", socket.id);
    console.log("watcher set", socket.id);
    console.log("broadcasterId", broadcasterId);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
    console.log("offer sent", message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
    console.log("answer sent");
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
    console.log("candidate", message);
  });

  socket.on("close", () => {
    console.log("closed socket")
  })

  socket.on("new-broadcaster", (broadcaster) => {
    socket.broadcast.emit("active-broadcaster", broadcaster);
    console.log("active-broadcaster emitted");
  });
  
  socket.on("watcher-disconnect", () => {
    console.log("watcher disconnected")
    socket.emit("disconnectPeer", socket.id)
  })

  socket.on("new message", (data) => {
    console.log(data.room);
    socket.broadcast.to(data.room).emit("receive message", data);
  });
  socket.on("room", (data) => {
    console.log("room join");
    console.log(data);
    socket.join(data.room);
  });

  socket.on("leave room", (data) => {
    console.log("leaving room");
    console.log(data);
    socket.leave(data.room);
  });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = app;
