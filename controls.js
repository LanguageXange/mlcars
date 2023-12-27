class Controls {
  constructor() {
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    this.#keyboardListener();
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
    }
    console.table(this);
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
    }
  }
  #keyboardListener() {
    document.addEventListener("keydown", (e) => this.#handleKeyDown(e));
    document.addEventListener("keyup", this.#handleKeyUp.bind(this));
  }
}
