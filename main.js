const socketio = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");

/*
import socket from "socket.io";
import express from "express";
import http from "http";
*/

const app = express();
app.use(cors());
app.get("/chatApp", (req, res) => res.sendFile(__dirname + "/client.html"));
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
    //socket.broadcast.emit("chat", msg);
  });

  socket.on("forceDisconnect", () => {
    socket.disconnect();
  });

  socket.on("disconnect", (data) => {
    console.log("user disconnected: " + socket.name);
    console.log(
      "Client logged-out:\n name:" + socket.name + "\n userid: " + socket.userid
    );

    io.emit("loggedOut", socket.name);
    //socket.broadcast.emit("chat", msg);
  });
});
