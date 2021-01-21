const chatlog = document.getElementById("chatLogs");
const formBtn = document.getElementById("formBtn");
const chatForm = document.getElementById("chatForm");

function buttonClicked() {
  const socket = io("localhost:5500");
  socket.emit("login", {
    name: makeRandomName(),
    userid: "test_id",
  });

  socket.on("login", (data) => {
    const msg = "<div><strong>" + data + "</strong> has joined</div>";
    chatlog.innerHTML(msg);
  });

  socket.on("chat", (data) => {
    const msg =
      "<div>" +
      data.msg +
      " : from <strong>" +
      data.from.name +
      "</strong></div>";
    chatlog.innerHTML(msg);
  });

  formBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const input = document.getElementById("msgForm");
    chatForm.submit();
    socket.emit("chat", { msg: input.value });
    input.value = "";
  });

  function makeRandomName() {
    let name = "";
    const possible = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 3; i++) {
      name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
  }
}

buttonClicked();
