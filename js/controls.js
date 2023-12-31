class Controls {
  constructor(type) {
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    this.boost = false;
    this.stop = false;

    switch (type) {
      case "KEYS":
        this.#keyboardListener();
        break;
      default:
        this.forward = true;
        break;
    }
  }

  // private method

  #handleKeyDown(e) {
    switch (e.key) {
      case "ArrowLeft":
        this.left = true;
        break;
      case "ArrowRight":
        this.right = true;
        break;
      case "ArrowUp":
        this.forward = true;
        break;
      case "ArrowDown":
        this.backward = true;
        break;
      case " ":
        this.boost = true;
        break;
      case "a":
        this.stop = true;
        break;
    }
    //console.table(this);
  }
  #handleKeyUp(e) {
    switch (e.key) {
      case "ArrowLeft":
        this.left = false;
        break;
      case "ArrowRight":
        this.right = false;
        break;
      case "ArrowUp":
        this.forward = false;
        break;
      case "ArrowDown":
        this.backward = false;
        break;
      case " ":
        this.boost = false;
        break;
      case "a":
        this.stop = false;
        break;
    }
  }
  #keyboardListener() {
    document.addEventListener("keydown", (e) => this.#handleKeyDown(e));
    document.addEventListener("keyup", this.#handleKeyUp.bind(this));
  }
}
