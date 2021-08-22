class App {
  constructor() {
    console.log("app has started . . .");
    this.controller = new Controller();
  }

  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
      return App.instance;
    } else {
      throw "App is currently running.";
    }
  }
}

// application controller
class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.books;
    this.loadBooks();
  }

  loadBooks() {
    // check local storage keys
    if (window.localStorage.length === 0) {
      books.forEach((book) => {
        localStorage.setItem(`${book.title}`, JSON.stringify(book));
      });
    }

    // add books to array
    this.books = Utils.loadFromStorage();

    // custom event
    const booksLoadedEvent = new Event("books_loaded");
    booksLoadedEvent.books = this.books;
    document.dispatchEvent(booksLoadedEvent);

  }
}

// application model
class Model {
  constructor() {
    document.addEventListener("books_loaded", e => this.process(e));
  }

  process(e){
    const booksToRead = [];
    const booksRead = [];
    const booksCurrentlyReading = [];
    const path = window.location.pathname;

    // add to appropriate array
    e.books.forEach((book) => {
      
    });
  }
}

// application view
class View {
  constructor() {
    this.menuBtn = document.querySelector("#menu-btn");
    this.menuBtn.addEventListener("click", this.openOffCanvasMenu);
    window.addEventListener("resize", this.changeAriaAttr);
    Utils.getCurrentPage();
    this.changeAriaAttr();
  }

  // change attributes
  changeAriaAttr() {
    const vw = window.innerWidth;
    const navbar = document.querySelector(".navbar-nav");
    const menuBtn = document.querySelector("#menu-btn");
    const offcanvas = document.querySelector(".offcanvas");
    const overlay = document.querySelector(".overlay");

    // set aria attribute based on viewpport width
    if (vw > 767) {
      navbar.setAttribute("aria-hidden", "false");
      menuBtn.setAttribute("aria-hidden", "true");
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.display = "none";
      offcanvas.setAttribute("aria-hidden", "true");
    } else if (vw <= 768) {
      navbar.setAttribute("aria-hidden", "true");
      menuBtn.setAttribute("aria-hidden", "false");
      overlay.setAttribute("aria-hidden", "false");
      offcanvas.setAttribute("aria-hidden", "false");
    }
  }

  addToDashboard() {}

  display() {}

  // open off canvas menu
  openOffCanvasMenu() {
    const navbar = document.querySelector(".navbar-nav");
    const menuBtn = document.querySelector("#menu-btn");
    const offcanvas = document.querySelector(".offcanvas");
    const overlay = document.querySelector(".overlay");
    const closeBtn = document.querySelector(".close-btn");
    const exitTriggers = [closeBtn, overlay];

    // add class
    offcanvas.classList.add("offcanvas-active");

    // select all links
    const links = document.querySelectorAll(".offcanvas__nav li");

    // overlay styles
    overlay.style.display = "block";
    overlay.style.animation = "overlayFadeIn 0.5s forwards ease";

    // nav link style
    links.forEach((link, index) => {
      link.style.animation = `offcanvasFadeIn 0.5s ease forwards ${
        index / 7 + 0.2
      }s`;
    });

    // add event listeners
    exitTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        offcanvas.classList.remove("offcanvas-active");
        overlay.style.animation = "";
        overlay.style.display = "none";
        links.forEach((link, index) => {
          link.style.animation = ``;
        });
      });
    });
  }
}

// start application
(() => {
  const app = App.getInstance();
})();
