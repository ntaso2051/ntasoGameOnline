"use strict";
const socket = io.connect();
const canvas = document.querySelector("#canvas-2d");

const screen = new Screen(socket, canvas);

screen.animate(0);

$(window).on("beforeunload", (event) => {
  socket.disconnect();
});

let objMovement = {};
$(document).on("keydown keyup", (event) => {
  const KeyToCommand = {
    ArrowUp: "forward",
    ArrowDown: "back",
    ArrowLeft: "left",
    ArrowRight: "right",
  };
  const command = KeyToCommand[event.key];
  if (command) {
    if (event.type === "keydown") {
      objMovement[command] = true;
    } else {
      objMovement[command] = false;
    }
    socket.emit("change-my-movement", objMovement);
  }
});

$("#start-button").on("click", () => {
  // サーバーに'enter-the-game'を送信
  const objConfig = { strNickName: $("#nickname").val() };
  socket.emit("enter-the-game", objConfig);
  $("#start-screen").hide();
});
