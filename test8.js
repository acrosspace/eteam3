class Title {
  element;
  color = "blue";

  constructor() {
    this.element = document.getElementById("title");
    this.element.style.position = "absolute";
    this.element.style.left = 100 + "px";
    this.element.style.top = 100 + "px";

    setInterval(this.updateTitle, 100);
  }

  updateTitle = () => {
    this.element.style.left = parseInt(this.element.style.left) + 1 + "px";
    this.element.style.top = parseInt(this.element.style.top) + 1 + "px";
  };

  static init = () => {
    console.log("Initialized!!!");
  };
}

Title.init();

var title2 = new Title();

console.log(title2.color);

title2.element.style.color = "magenta";
