class App {
  constructor() {
    console.log("app has started . . .");
    this.controller = new Controller();
    Utils.getCurrentPage();
    document.querySelector('#contact-btn').addEventListener('click', this.goToContact);
  }

  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
      return App.instance;
    } else {
      throw "App is currently running.";
    }
  }

  goToContact(){
    window.location = "/contact.html";
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

    // add books to array
    this.books = Utils.loadFromStorage();

    // check local storage keys
    if (this.books.length === 0) {
      books.forEach((book) => {
        localStorage.setItem(`${book.title}`, JSON.stringify(book));
      });

      this.books = Utils.loadFromStorage();
    }

    

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
    document.addEventListener("books_processed", (e) => this.display(e));
    Utils.getCurrentPage();
    this.changeAriaAttr();
    this.books;
    this.path;
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
    this.path = window.location.pathname;
    this.books = e.allBooks;


    if(this.path == "/"){
      this.addInDashboard(
        e.allBooks,
        e.booksToRead,
        e.booksCurrentlyReading,
        e.booksRead
      );
    }

    
    switch (this.path) {
      case "/index.html":
        this.addInDashboard(
          e.allBooks,
          e.booksToRead,
          e.booksCurrentlyReading,
          e.booksRead
        );
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
        this.addInSingle(this.currentBook);
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
    const totalBooksHTML = Utils.buildStats(
      `${allBooks.length}`,
      "Total Books"
    );
    const booksToReadHTML = Utils.buildStats(
      `${booksToRead.length}`,
      "To Read"
    );
    const booksReadingHTML = Utils.buildStats(
      `${booksReading.length}`,
      "Currently Reading"
    );
    const booksReadHTML = Utils.buildStats(`${booksRead.length}`, "Complete");

    // Add to the DOM
    row.insertAdjacentHTML("afterbegin", totalBooksHTML);
    row.insertAdjacentHTML("beforeend", booksToReadHTML);
    row.insertAdjacentHTML("beforeend", booksReadingHTML);
    row.insertAdjacentHTML("beforeend", booksReadHTML);

    const recentlyAddedSection = document.querySelector("#recently-added");
    const recentlyAddedRowHTML = `<div class="row mt-5" id="recently-added-books"> </div>`;
    recentlyAddedSection.insertAdjacentHTML("beforeend", recentlyAddedRowHTML);
    const recentlyAddedBooks = allBooks.slice(Math.max(allBooks.length - 6, 0));

    recentlyAddedBooks.forEach((book) => {
      const bookHTML = Utils.recentlyAddedTemplate(
        book.cover,
        book.title,
        book.author
      );
      document.querySelector("#recently-added-books").insertAdjacentHTML("beforeend", bookHTML);
    });

    const books = document.querySelectorAll(".book");
    books.forEach((book) => {
      book.addEventListener("click", () => {
        const bookTitle = book.querySelector(".card-title").innerHTML;
        let clickedBook = localStorage.getItem(bookTitle);
        clickedBook = JSON.parse(clickedBook);
        localStorage.setItem("activebook", JSON.stringify(clickedBook));
        window.location = "/single.html";
      })
    })

    document.querySelector('#see-all-btn').addEventListener("click", () =>{
      window.location.href = window.origin + `/library.html`;
    });

  }

  // to read page
  addInToRead(arr) {
    Utils.addBooksToPage(arr, `#books-to-read`, "to read");
    Utils.formSubmitAction(this.books, this.path);
    Utils.getClickedBook();
    document.addEventListener("book_clicked", (e) => this.checkClickedBook(e));
  }

  // currently reading page
  addInReading(arr) {
    Utils.addBooksToPage(arr, `#currently-reading`, "currently reading");
    Utils.formSubmitAction(this.books, this.path);
    Utils.getClickedBook();
    document.addEventListener("book_clicked", (e) => this.checkClickedBook(e));
  }

  // read page
  addInRead(arr) {
    Utils.addBooksToPage(arr, `#books-read`, "read");
    Utils.getClickedBook();
    Utils.formSubmitAction(this.books, this.path);
    document.addEventListener("book_clicked", (e) => this.checkClickedBook(e));
  }

  checkClickedBook(e) {
    const book = e.book;
    const bookTitle = e.book.querySelector(".card-title").innerHTML;
    let clickedBook = localStorage.getItem(bookTitle);
    clickedBook = JSON.parse(clickedBook);
    localStorage.setItem("activebook", JSON.stringify(clickedBook));
    window.location = "/single.html";
  }

  addInSingle() {
    let currentBook = localStorage.getItem("activebook");
    currentBook = JSON.parse(currentBook);

    const HTML = Utils.SinglePageTemplate(currentBook);
    const path = window.location.pathname;

    if (path === "/single.html") {
      const section = document.querySelector("#single-book");
      section.insertAdjacentHTML("afterbegin", HTML);
      document.title = currentBook.title;
    }

    this.setBookStatus(currentBook);
  }

  // check book status and set button colors
  setBookStatus(book) {
    // Buttons
    const bookmarkBtn = document.querySelector("#bookmark-btn");
    const readingBtn = document.querySelector("#reading-btn");
    const completeBtn = document.querySelector("#completed-btn");
    const deleteBtn = document.querySelector("#delete-btn");
    const buttons = [bookmarkBtn, readingBtn, completeBtn, deleteBtn];
    const books = this.books;
    const bookmarked = "bookmarked";
    const read = "read";
    const currentlyReading = "reading";

    // Check status
    switch (book.status) {
      case "bookmarked":
        bookmarkBtn.classList.add("active");
        break;
      case "read":
        completeBtn.classList.add("active");
        break;
      case "reading":
        readingBtn.classList.add("active");
        break;
      default:
    }

    // book mark button
    bookmarkBtn.addEventListener("click", () => {
      if (book.status !== bookmarked) {
        book.status = bookmarked;
        localStorage.setItem(`${book.title}`, JSON.stringify(book));
        const loadedBook = localStorage.getItem(`${book.title}`);
        const updatedBook = JSON.parse(loadedBook);
        const index = books.findIndex((el) => el.title === book.title);
        this.books[index] = updatedBook;
      }

      buttons.forEach((btn) => {
        if (btn.id !== bookmarkBtn.id) {
          btn.classList.remove("active");
          window.location = "/to-read.html";
        }
        if (btn.id === bookmarkBtn.id) {
          btn.classList.add("active");
        }
      });
    });

    // currently reading
    readingBtn.addEventListener("click", () => {
      if (book.status !== currentlyReading) {
        book.status = currentlyReading;
        localStorage.setItem(`${book.title}`, JSON.stringify(book));
        const loadedBook = localStorage.getItem(`${book.title}`);
        const updatedBook = JSON.parse(loadedBook);
        const index = books.findIndex((el) => el.title === book.title);
        this.books[index] = updatedBook;
      }

      buttons.forEach((btn) => {
        if (btn.id !== readingBtn.id) {
          btn.classList.remove("active");
          window.location = "/reading.html";
        }
        if (btn.id === readingBtn.id) {
          btn.classList.add("active");
        }
      });
    });

    // read
    completeBtn.addEventListener("click", () => {
      if (book.status !== read) {
        book.status = read;
        localStorage.setItem(`${book.title}`, JSON.stringify(book));
        const loadedBook = localStorage.getItem(`${book.title}`);
        const updatedBook = JSON.parse(loadedBook);
        const index = books.findIndex((el) => el.title === book.title);
        this.books[index] = updatedBook;
      }

      buttons.forEach((btn) => {
        if (btn.id !== completeBtn.id) {
          btn.classList.remove("active");
          window.location = "/read.html";
        }
        if (btn.id === completeBtn.id) {
          btn.classList.add("active");
        }
      });
    });

    // delete
    deleteBtn.addEventListener("click", () => {
      localStorage.removeItem(`${book.title}`);
      if (document.referrer) {
        window.location = document.referrer;
      }
    });
  }

  addInLibrary(arr) {
    Utils.addBooksToPage(arr, `#all-books`, "in your library");
    Utils.getClickedBook();
    Utils.formSubmitAction(this.books, this.path);
    document.addEventListener("book_clicked", (e) => this.checkClickedBook(e));

  }

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
