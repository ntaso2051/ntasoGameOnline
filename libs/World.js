const Item = require("./Item.js");
const Player = require("./Player.js");
const OverlapTester = require("./OverlapTester.js");
const GameSettings = require("./GameSettings.js");
const SharedSettings = require("../public/js/SharedSettings.js");
module.exports = class World {
  constructor(io) {
    this.io = io;
    this.setPlayer = new Set();
    this.setItem = new Set();
    this.result = new Map();

    for (let i = 0; i < GameSettings.ITEM_COUNT; i++) {
      const fX_left =
        Math.random() *
        (SharedSettings.FIELD_WIDTH - SharedSettings.ITEM_WIDTH);
      const fY_bottom =
        Math.random() *
        (SharedSettings.FIELD_HEIGHT - SharedSettings.ITEM_HEIGHT);
      const item = new Item(
        fX_left + SharedSettings.ITEM_WIDTH * 0.5,
        fY_bottom + SharedSettings.ITEM_HEIGHT * 0.5,
        i
      );
      this.setItem.add(item);
    }
  }

  // 更新処理
  update(fDeltaTime) {
    // オブジェクトの座標値の更新
    this.updateObjects(fDeltaTime);

    // 衝突チェック
    this.checkCollisions();

    // 新たな行動（特に、ボットに関する生成や動作
    this.doNewActions(fDeltaTime);
  }

  // オブジェクトの座標値の更新
  updateObjects(fDeltaTime) {
    const rectItemField = {
      fLeft: 0 + SharedSettings.ITEM_WIDTH * 0.5,
      fBottom: 0 + SharedSettings.ITEM_HEIGHT * 0.5,
      fRight: 0 + SharedSettings.FIELD_WIDTH - SharedSettings.ITEM_WIDTH * 0.5,
      fTop: 0 + SharedSettings.FIELD_HEIGHT - SharedSettings.ITEM_HEIGHT * 0.5,
    };
    //プレイヤーごとの処理
    this.setPlayer.forEach((player) => {
      player.update(fDeltaTime, rectItemField, this.setItem);
    });
    //アイテムごとの処理
    this.setItem.forEach((item) => {});

    if (this.setItem.size < 5) {
      this.createItems();
    }
  }

  checkCollisions() {
    this.setItem.forEach((item) => {
      this.setPlayer.forEach((player) => {
        if (OverlapTester.overlapRects(player.rectBound, item.rectBound)) {
          this.getItem(player, item);
          this.destroyItem(item);
        }
      });
    });

    this.setPlayer.forEach((player) => {
      this.setPlayer.forEach((other) => {
        if (player != other) {
          if (OverlapTester.overlapRects(player.rectBound, other.rectBound)) {
            //console.log(
            //  `player1Type: ${player.iType}, player2Type: ${other.iType},${this.result}`
            //);
            if (
              player.iType == SharedSettings.GREEN_TYPE &&
              other.iType == SharedSettings.WATER_TYPE
            ) {
              //this.result.add(other.strNickName);
              this.destroyPlayer(other);
              player.rank++;
              this.result.set(player.strNickName, player.rank);
              //this.result.sort((a, b) => { return this.result[a] - this.result[b] });
            }
            if (
              player.iType == SharedSettings.WATER_TYPE &&
              other.iType == SharedSettings.FLAME_TYPE
            ) {
              //this.result.add(other.strNickName);
              this.destroyPlayer(other);
              player.rank++;
              this.result.set(player.strNickName, player.rank);
              //this.result.sort((a, b) => { return this.result[a] - this.result[b] });
            }
            if (
              player.iType == SharedSettings.FLAME_TYPE &&
              other.iType == SharedSettings.GREEN_TYPE
            ) {
              //this.result.add(other.strNickName);
              this.destroyPlayer(other);
              player.rank++;
              this.result.set(player.strNickName, player.rank);
              //this.result.sort((a, b) => { return this.result[a] - this.result[b] });
            }
          }
        }
      });
    });
  }

  doNewActions(fDeltaTime) {}

  createPlayer(strSocketID, strNickName) {
    const rectPlayerField = {
      fLeft: 0 + SharedSettings.PLAYER_WIDTH * 0.5,
      fBottom: 0 + SharedSettings.PLAYER_HEIGHT * 0.5,
      fRight:
        0 + SharedSettings.FIELD_WIDTH - SharedSettings.PLAYER_WIDTH * 0.5,
      fTop:
        0 + SharedSettings.FIELD_HEIGHT - SharedSettings.PLAYER_HEIGHT * 0.5,
    };

    const player = new Player(
      strSocketID,
      strNickName,
      rectPlayerField,
      this.setItem
    );
    this.setPlayer.add(player);
    return player;
  }

  destroyPlayer(player) {
    this.setPlayer.delete(player);

    //console.log(this.result);

    this.io.to(player.strSocketID).emit("dead");
  }

  destroyItem(item) {
    this.setItem.delete(item);
  }

  getItem(player, item) {
    player.iType = item.iType;
  }

  createItems() {
    for (let i = 0; i < GameSettings.ITEM_COUNT; i++) {
      const fX_left =
        Math.random() *
        (SharedSettings.FIELD_WIDTH - SharedSettings.ITEM_WIDTH);
      const fY_bottom =
        Math.random() *
        (SharedSettings.FIELD_HEIGHT - SharedSettings.ITEM_HEIGHT);
      const item = new Item(
        fX_left + SharedSettings.ITEM_WIDTH * 0.5,
        fY_bottom + SharedSettings.ITEM_HEIGHT * 0.5,
        i
      );
      this.setItem.add(item);
    }
  }
};
