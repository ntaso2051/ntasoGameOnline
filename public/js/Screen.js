//const SharedSettings = require("./SharedSettings.js");

class Screen {
  constructor(socket, canvas) {
    this.socket = socket;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.assets = new Assets();
    this.iProcessingTimeNanoSec = 0;
    this.aPlayer = null;
    this.anItem = null;
    this.results = null;
    this.resCopy = new Array();
    this.resCnt = 0;

    this.canvas.width = SharedSettings.FIELD_WIDTH;
    this.canvas.height = SharedSettings.FIELD_HEIGHT;

    this.initSocket();

    this.context.mozImageSmoothingEnabled = false;
    this.context.webkitImageSmoothingEnabled = false;
    this.context.msImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;
  }

  initSocket() {
    this.socket.on("connect", () => {
      //console.log("connect : socket.id = %s", socket.id);
      //this.socket.emit("enter-the-game");
    });

    this.socket.on(
      "update",
      (aPlayer, anItem, result, iProcessingTimeNanoSec) => {
        this.aPlayer = aPlayer;
        this.anItem = anItem;
        this.results = result;
        this.iProcessingTimeNanoSec = iProcessingTimeNanoSec;
      }
    );

    this.socket.on("dead", () => {
      $("#start-screen").show();
      this.resCnt++;
    });
  }

  animate(iTimeCurrent) {
    requestAnimationFrame((iTimeCurrent) => {
      this.animate(iTimeCurrent);
    });
    this.render(iTimeCurrent);
  }

  render(iTimeCurrent) {
    //console.log("render !!");

    let playerSelf = null;

    if (null !== this.aPlayer) {
      this.aPlayer.some((player) => {
        //console.log(`${player.strSocketID}: ${this.socket.id}`);
        if (player.strSocketID === this.socket.id) {
          playerSelf = player;
          return true;
        }
      });
    }
    //console.log(playerSelf);
    this.context.clearRect(0, 0, canvas.width, canvas.height);

    this.renderField();

    if (null !== this.aPlayer) {
      const fTimeCurrentSec = iTimeCurrent * 0.001;
      const iIndexFrame = parseInt(fTimeCurrentSec / 0.2) % 4;
      this.aPlayer.forEach((player) => {
        this.renderPlayer(player, iIndexFrame);
        //console.log(player);
      });
    }

    if (null !== this.anItem) {
      this.anItem.forEach((item) => {
        //console.log(item);
        this.renderItem(item);
      });
    }

    this.context.save();
    this.context.strokeStyle = RenderingSettings.FIELD_LINECOLOR;
    this.context.lineWidth = RenderingSettings.FIELD_LINEWIDTH;
    this.context.strokeRect(0, 0, canvas.width, canvas.height);
    this.context.restore();

    if (null !== playerSelf) {
      //console.log("success");
      this.context.save();
      this.context.font = RenderingSettings.PROCESSINGTIME_FONT;
      this.context.fillStyle = RenderingSettings.PROCESSINGTIME_COLOR;
      let myType;
      if (playerSelf.iType === SharedSettings.GREEN_TYPE) {
        myType = "LEAF";
      }
      if (playerSelf.iType === SharedSettings.WATER_TYPE) {
        myType = "WATER";
      }
      if (playerSelf.iType === SharedSettings.FLAME_TYPE) {
        myType = "FLAME";
      }
      this.context.fillText(`Your type is ${myType}`, 20, 40);
      this.context.restore();
    }

    if (null !== this.results) {
      this.renderResults(this.results);
    }

    // this.context.save();
    // this.context.font = RenderingSettings.PROCESSINGTIME_FONT;
    // this.context.fillStyle = RenderingSettings.PROCESSINGTIME_COLOR;
    // this.context.fillText(
    //   (this.iProcessingTimeNanoSec * 1e-9).toFixed(9) + " [s]",
    //   this.canvas.width - 30 * 10,
    //   40
    // );
    // this.context.restore();
  }

  renderResults(results) {
    let i = 0;
    const ress = [...results.entries()].sort((a, b) => b[1][1] - a[1][1]);
    console.log(ress);
    ress.forEach((res) => {
      this.context.save();
      this.context.font = RenderingSettings.PROCESSINGTIME_FONT;
      this.context.font = RenderingSettings.PROCESSINGTIME_COLOR;
      //console.log(res);
      this.context.fillText(
        `${i + 1}位 ${res[1][0]}: ${res[1][1]}pt`,
        this.canvas.width - 250,
        i * 50 + 100
      );
      this.context.restore();
      i++;
    });
  }

  renderField() {
    this.context.save();

    let iCountX = parseInt(
      SharedSettings.FIELD_WIDTH / RenderingSettings.FIELDTILE_WIDTH
    );
    let iCountY = parseInt(
      SharedSettings.FIELD_HEIGHT / RenderingSettings.FIELDTILE_HEIGHT
    );
    for (let iIndexY = 0; iIndexY < iCountY; iIndexY++) {
      for (let iIndexX = 0; iIndexX < iCountX; iIndexX++) {
        this.context.drawImage(
          this.assets.imageField,
          this.assets.rectFieldInFieldImage.sx,
          this.assets.rectFieldInFieldImage.sy,
          this.assets.rectFieldInFieldImage.sw,
          this.assets.rectFieldInFieldImage.sh,
          iIndexX * RenderingSettings.FIELDTILE_WIDTH,
          iIndexY * RenderingSettings.FIELDTILE_HEIGHT,
          RenderingSettings.FIELDTILE_WIDTH,
          RenderingSettings.FIELDTILE_HEIGHT
        );
      }
    }
    this.context.restore();
  }
  renderPlayer(player, iIndexFrame) {
    this.context.save();
    this.context.translate(player.fX, player.fY);
    this.context.save();
    this.context.drawImage(
      this.assets.imageItems,
      this.assets.arectPlayerInItemsImage[iIndexFrame].sx,
      this.assets.arectPlayerInItemsImage[iIndexFrame].sy,
      this.assets.arectPlayerInItemsImage[iIndexFrame].sw,
      this.assets.arectPlayerInItemsImage[iIndexFrame].sh,
      -SharedSettings.PLAYER_WIDTH * 0.5,
      -SharedSettings.PLAYER_HEIGHT * 0.5,
      SharedSettings.PLAYER_WIDTH,
      SharedSettings.PLAYER_HEIGHT
    );
    this.context.restore();

    let myColor;
    if (player.iType === SharedSettings.GREEN_TYPE) {
      myColor = RenderingSettings.LEAF_COLOR;
    }
    if (player.iType === SharedSettings.WATER_TYPE) {
      myColor = RenderingSettings.WATER_COLOR;
    }
    if (player.iType === SharedSettings.FLAME_TYPE) {
      myColor = RenderingSettings.FLAME_COLOR;
    }
    this.context.save();
    this.context.textAlign = "center";
    this.context.font = RenderingSettings.PROCESSINGTIME_FONT;
    this.context.fillStyle = myColor;
    this.context.fillText(player.strNickName, 0, -50);
    this.context.restore();

    this.context.restore();
  }
  renderItem(item) {
    this.context.drawImage(
      this.assets.imageItem,
      this.assets.arectItemInItemsImage[item.iType].sx,
      this.assets.arectItemInItemsImage[item.iType].sy,
      this.assets.arectItemInItemsImage[item.iType].sw,
      this.assets.arectItemInItemsImage[item.iType].sh,
      item.fX - SharedSettings.ITEM_WIDTH * 0.5,
      item.fY - SharedSettings.ITEM_HEIGHT * 0.5,
      SharedSettings.ITEM_WIDTH,
      SharedSettings.ITEM_WIDTH
    );
  }
}
