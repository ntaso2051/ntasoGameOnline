const World = require("./World.js");
const GameSettings = require("./GameSettings.js");

module.exports = class Game {
  start(io) {
    const world = new World(io);
    let iTimeLast = Date.now();

    io.on("connection", (socket) => {
      console.log("connection : socket.id = %s", socket.id);
      let player = null;

      socket.on("enter-the-game", (objConfig) => {
        console.log(`enter-the-game : socket.id = ${socket.id}`);
        player = world.createPlayer(socket.id, objConfig.strNickName);
      });

      socket.on("change-my-movement", (objMovement) => {
        if (!player) {
          return;
        }
        player.objMovement = objMovement;
      });

      socket.on("disconnect", () => {
        console.log("disconnect : socket.id = %s", socket.id);
        if (!player) return;
        world.destroyPlayer(player);
        player = null;
      });
    });

    setInterval(() => {
      const iTimeCurrent = Date.now();
      const fDeltaTime = (iTimeCurrent - iTimeLast) * 0.001;
      iTimeLast = iTimeCurrent;
      //console.log("DeltaTime = %f[s]", fDeltaTime);

      const hrtime = process.hrtime();

      world.update(fDeltaTime);

      const hrtimeDiff = process.hrtime(hrtime);
      const iNanosecDiff = hrtimeDiff[0] * 1e9 + hrtimeDiff[1];

      io.emit(
        "update",
        Array.from(world.setPlayer),
        Array.from(world.setItem),
        Array.from(world.result),
        iNanosecDiff
      );
    }, 1000 / GameSettings.FRAMERATE);
  }
};
