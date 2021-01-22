const socketio = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "")));

app.get("/chatApp", (req, res) => res.sendFile(__dirname + "/client.html"));
app.get("/paintApp", (req, res) => res.sendFile(__dirname + "/index.html"));

const server = http.createServer(app);

server.listen(5500, () => console.log("#### 서버 시작 ####"));

const io = socketio(server);

io.on("connection", (socket) => {
  const { url } = socket.request;
  console.log(`연결됨: ${url}`);

  socket.on("login", (data) => {
    console.log(
      "Client logged-in:\n name:" + data.name + "\n userid: " + data.userid
    );
    socket.name = data.name;
    socket.userid = data.userid;

    io.emit("login", data.name);
  });

  socket.on("chat", (data) => {
    console.log("Message from %s: %s", socket.name, data.msg);

    const msg = {
      from: {
        name: socket.name,
        userid: socket.userid,
      },
      msg: data.msg,
    };
    io.emit("chat", msg);
  });

  socket.on("forceDisconnect", () => {
    socket.disconnect();
  });

  socket.on("disconnect", (data) => {
    if (
      socket.name == null ||
      typeof socket.name == undefined ||
      socket.name == ""
    ) {
      return;
    }
    console.log("user disconnected: " + socket.name);
    console.log(
      "Client logged-out:\n name:" + socket.name + "\n userid: " + socket.userid
    );
    io.emit("loggedOut", socket.name);
  });

  socket.on("paint", (obj) => {
    io.emit("paint", obj);
  });
});
