"use strict";

let chatlog = document.getElementById("chatLogs");
const formBtn = document.getElementById("formBtn");
const chatForm = document.getElementById("chatForm");
const clearBtn = document.getElementById("clearBtn");
const userName = document.getElementById("userName");
const nameBtn = document.getElementById("nameBtn");

let user = -1;
let socket = -1;
let socket_paint = -1;

nameBtn.addEventListener("click", (event) => {
  if (socket != -1 || socket_paint != -1) {
    return;
  }
  if (
    userName.value == null ||
    typeof userName.value == "undefined" ||
    userName.value == "null" ||
    userName.value == "" ||
    userName.value.length > 10
  ) {
    alert("이름을 다시 입력해주세요");
    return;
  }
  user = {
    name: userName.value,
    userid: "test_id",
  };
  event.preventDefault();
  joinChat(user);
  joinPaint();
});

function joinChat(user) {
  socket = io(`${document.domain}:${location.port}`);
  socket.emit("login", user);

  socket.on("login", (data) => {
    const msg =
      '<div class="chat__content"><strong>' +
      data +
      "</strong> has joined</div>";
    chatlog.innerHTML = chatlog.innerHTML + msg;
  });

  socket.on("chat", (data) => {
    const msg =
      '<div class="chat__content" id="chatMsg">' +
      "<strong>" +
      data.from.name +
      "</strong>" +
      ": " +
      "<div style='display:inline'>" +
      data.msg +
      "</div>";
    chatlog.innerHTML = chatlog.innerHTML + msg;
    chatlog.scrollTop = chatlog.scrollHeight;
  });

  socket.on("loggedOut", (name) => {
    const msg =
      '<div class="chat__content"><strong>' + name + "</strong> went out</div>";
    chatlog.innerHTML = chatlog.innerHTML + msg;
  });

  formBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const input = document.getElementById("msgForm");
    if (
      input.value == "" ||
      typeof input.value == undefined ||
      input.value == null
    ) {
      return;
    }
    socket.emit("chat", { msg: input.value });
    input.value = "";
  });

  clearBtn.addEventListener("click", (event) => {
    event.preventDefault();
    chatlog.innerHTML = "";
  });

  function makeRandomName() {
    let name = "";
    const possible = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 7; i++) {
      name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
  }
}
