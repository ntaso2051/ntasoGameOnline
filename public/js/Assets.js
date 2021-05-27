
class Assets {
  constructor() {
    this.imageField = new Image();
    this.imageField.src = "../images/background.png";

    this.rectFieldInFieldImage = { sx: 0, sy: 0, sw: 256, sh: 256 };

    this.imageItems = new Image();
    this.imageItems.src = "../images/players.png";

    this.arectPlayerInItemsImage = [
      { sx: 0, sy: 0, sw: 32, sh: 32 },
      { sx: 32, sy: 0, sw: 32, sh: 32 },
      { sx: 64, sy: 0, sw: 32, sh: 32 },
      { sx: 96, sy: 0, sw: 32, sh: 32 },
    ];

    this.imageItem = new Image();
    this.imageItem.src = "../images/items.png";

    this.arectItemInItemsImage = [
      { sx: 0, sy: 0, sw: 32, sh: 32 },
      { sx: 32, sy: 0, sw: 32, sh: 32 },
      { sx: 64, sy: 0, sw: 32, sh: 32 },
    ];
  }
}
