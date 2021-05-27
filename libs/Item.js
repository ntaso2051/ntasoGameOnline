const GameObject = require("./GameObject.js");
const OverlapTester = require("./OverlapTester.js");

const SharedSettings = require("../public/js/SharedSettings.js");
const { GREEN_TYPE } = require("./GameSettings.js");

module.exports = class Item extends GameObject {
  constructor(fX, fY, i) {
    super(SharedSettings.ITEM_WIDTH, SharedSettings.ITEM_HEIGHT, fX, fY, 0);
    if (i % 3 == 0) {
      this.iType = SharedSettings.GREEN_TYPE;
    } else if (i % 3 == 1) {
      this.iType = SharedSettings.WATER_TYPE;
    } else if (i % 3 == 2) {
      this.iType = SharedSettings.FLAME_TYPE;
    }
  }
  toJSON() {
    return Object.assign(super.toJSON(), {
      iType: this.iType,
    });
  }
};
