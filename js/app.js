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
    document.addEventListener("books_loaded", (e) => this.process(e));
  }

  process(e) {
    const booksToRead = [];
    const booksRead = [];
    const booksCurrentlyReading = [];

    // add to appropriate array
    e.books.forEach((book) => {
      switch (book.status) {
        case "bookmarked":
          booksToRead.push(book);
          break;
        case "read":
          booksRead.push(book);
          break;
        case "reading":
          booksCurrentlyReading.push(book);
          break;
        default:
          break;
      }
    });

    // Send books to the view
    const booksProcessedEvent = new Event("books_processed");
    booksProcessedEvent.allBooks = e.books;
    booksProcessedEvent.booksToRead = booksToRead;
    booksProcessedEvent.booksRead = booksRead;
    booksProcessedEvent.booksCurrentlyReading = booksCurrentlyReading;
    document.dispatchEvent(booksProcessedEvent);
  }
}

// application view
class View {
  constructor() {
    this.menuBtn = document.querySelector("#menu-btn");
    this.menuBtn.addEventListener("click", this.openOffCanvasMenu);
    window.addEventListener("resize", this.changeAriaAttr);
    document.addEventListener("books_processed", e => this.display(e));
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

  display(e) {
    const path = window.location.pathname;

    switch(path){
      case "/index.html":
        this.addInDashboard(e.allBooks, e.booksToRead, e.booksCurrentlyReading,e.booksRead);
        break;
      case "/to-read.html":
        this.addInToRead(e.booksToRead);
        break;
      case "/reading.html":
        this.addInReading(e.booksCurrentlyReading);
        break;
      case "/read.html":
        this.addInRead(e.booksRead);
        break;
      case "/single.html":
        this.addInSingle();
        break;
      case "/library.html":
        this.addInLibrary(e.allBooks);
        break;
      default:
        break;
    }

  }

  // load content into dashboard
  addInDashboard(allBooks, booksToRead, booksReading, booksRead) {
    const stats = document.querySelector("#stats");
    let rowHTML = `<div class="row"></div>`;
    stats.insertAdjacentHTML("beforeend", rowHTML);
    const row = stats.querySelector(".row");

    // Create HTML template
    const totalBooksHTML = Utils.buildStats(`${allBooks.length}`, "Total Books");
    const booksToReadHTML = Utils.buildStats(`${booksToRead.length}`, "To Read");
    const booksReadingHTML = Utils.buildStats(`${booksReading.length}`, "Currently Reading");
    const booksReadHTML = Utils.buildStats(`${booksRead}`, "Complete");

    console.log(totalBooksHTML);

    // Add to the DOM
    row.insertAdjacentHTML("afterbegin", totalBooksHTML);

  }

  addInToRead(arr){}
  addInReading(arr){}
  addInRead(){}
  addInSingle(){}
  addInLibrary(arr){}

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
