const chatlog = document.getElementById("chatLogs");
const formBtn = document.getElementById("formBtn");
const chatForm = document.getElementById("chatForm");
const clearBtn = document.getElementById("clearBtn");

function buttonClicked() {
  console.log(`${document.domain}:${location.port}`);
  const socket = io(`${document.domain}:${location.port}`);
  socket.emit("login", {
    name: makeRandomName(),
    userid: "test_id",
  });

  socket.on("login", (data) => {
    const msg = "<div><strong>" + data + "</strong> has joined</div>";
    chatlog.innerHTML = chatlog.innerHTML + msg;
  });

  socket.on("chat", (data) => {
    const msg =
      '<div id="chatMsg">' +
      "<strong>" +
      data.from.name +
      "</strong>" +
      ": " +
      "<div style='display:inline'>" +
      data.msg +
      "</div>";
    chatlog.innerHTML = chatlog.innerHTML + msg;
  });

  socket.on("loggedOut", (name) => {
    const msg = "<div><strong>" + name + "</strong> went out</div>";
    chatlog.innerHTML = chatlog.innerHTML + msg;
  });

  formBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const input = document.getElementById("msgForm");
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

buttonClicked();
