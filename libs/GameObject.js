const OverlapTester = require("./OverlapTester.js");

module.exports = class GameObject {

  constructor(fWidth, fHeight, fX, fY, fAngle) {
    this.fWidth = fWidth;
    this.fHeight = fHeight;
    this.fX = fX;
    this.fY = fY;
    this.fAngle = fAngle;

    this.rectBound = {};
    this.setPos(fX, fY);
  }

  toJSON() {
    return {
      fX: this.fX,
      fY: this.fY,
      fAngle: this.fAngle,
    };
  }

  setPos(fX, fY) {
    this.fX = fX;
    this.fY = fY;
    this.rectBound = {
      fLeft: fX - this.fWidth * 0.5,
      fBottom: fY - this.fHeight * 0.5,
      fRight: fX + this.fWidth * 0.5,
      fTop: fY + this.fHeight * 0.5,
    };
  }

  overlapItems(setItem) {
    return Array.from(setItem).some((item) => {
      if (OverlapTester.overlapRects(this.rectBound, item.rectBound)) {
        return true;
      }
    });
  }
};
