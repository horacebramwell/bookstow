class Utils {
  constructor() {}

  // get current page
  static getCurrentPage() {
    const href = window.location.href;
    const links = document.querySelectorAll(".nav-link");

    links.forEach((link) => {
      if (href === link.href) {
        link.classList.add("current-page");
      }else if(window.location.pathname !== "/") {
        link.classList.remove("current-page");
      }
    });
  }

  // add books to page
  static addBooksToPage(arr, sectionID, msg) {
    const section = document.querySelector(sectionID);
    const headerSection = document
      .querySelector(".page-header")
      .querySelector("header");
    const subtitleHTML = `<h6 class="text-secondary">You have ${arr.length} books ${msg}</h6>`;
    const rowHTML = `<div class="row"></div>`;
    section.insertAdjacentHTML("afterbegin", rowHTML);
    headerSection.insertAdjacentHTML("beforeend", subtitleHTML);

    arr.forEach((book) => {
      const bookHTML = `
      <div class="col-sm-6 col-md-6 col-xl-3 mb-3">
        <div class="card rounded border text-center book" data-status="bookmarked" data-id="${book.id}">
            <div class="card-body text-center">
                <img src="${book.cover}" class="w-50 rounded shadow-sm pt-3" alt="">
                  <h5 class="card-title mt-4 h4 text-primary">${book.title}</h5>
                  <h6 class="card-subtitle mb-2 text-muted h6 text-secondary">by ${book.author}</h6>
            </div>
        </div>
      </div>
      `;
      section.querySelector(".row").insertAdjacentHTML("afterbegin", bookHTML);
    });
  }

  // stats tmeplate
  static buildStats(num, msg) {
    const HTML = `
    <div class="col-sm-6 col-md-6 col-xl-3 mb-3">
      <div class="card rounded border text-center py-5">
        <div class = "card-body">
          <h2 class ="card-title text-primary">${num}</h2>
          <h6 class = "card-subtitle mb-2 m-1 text-secondary">${msg}</h6>
        </div>
      </div>
    </div>`;

    return HTML;
  }

  static recentlyAddedTemplate(cover, title, author) {
    const bookHTML = `
    <div class="col-sm-6 col-md-6 col-xl-4 mb-4"> 
      <div class="card p-0 h-100 book">
        <div class="row g-0 align-center h-100">
          <div class="col-4 book-background">
            <img src="${cover}" class="img-fluid rounded shadow-sm" alt="${title} book cover">
          </div>
            <div class="col-8 my-auto p-0">
            <div class="card-body">
              <h5 class="card-title text-primary">${title}</h5>
              <h6 class="h6 text-muted text-secondary">by ${author}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    return bookHTML;
  }

  static SinglePageTemplate(book) {
    const singlePageHTML = `
    <img src="${book.cover}" alt="" class="rounded mx-auto d-block mb-4 w-sm-75 shadow-lg" id="single-book-cover">
    <h1 class="text-center mt-5 text-primary">${book.title}</h1>
    <h6 class="text-center mt-4 text-secondary">by ${book.author}</h6>

    <div class="container my-4">
        <div class="row justify-content-center">
            <div class='col-3 col-xl-1 col-md-2 col-sm-2 d-flex justify-content-center  align-items-center p-1'>
                <button class="rounded" id="bookmark-btn"> <i class="bi bi-bookmark"></i> Add to read list</button>
            </div>
            <div class='col-3 col-xl-1 col-md-2 col-sm-2 d-flex justify-content-center  align-items-center p-1'>
                <button class="rounded" id="reading-btn"><i class="bi bi-eye"></i> Add book to currently reading</button>
            </div>
            <div class='col-3 col-xl-1 col-md-2 col-sm-2 d-flex justify-content-center  align-items-center p-1'>
                <button class="rounded" id="completed-btn"><i class="bi bi-check2"></i> Mark book as completed</button>
            </div>
            <div class='col-3 col-xl-1 col-md-2 col-sm-2 d-flex justify-content-center  align-items-center p-1'>
                <button class="rounded" id="delete-btn"><i class="bi bi-trash"></i> Delete book</button>
            </div>
        </div>
      </div>

    <p class='w-75 m-auto text-center mt-5'>
        ${book.summary}
    </p>
    `;

    return singlePageHTML;
  }



  // Check book clicked
  static getClickedBook() {
    const books = document.querySelectorAll(".card");
    books.forEach((book) => {
      book.addEventListener("click", () => {
        const evt = new Event("book_clicked");
        evt.book = book;
        document.dispatchEvent(evt);
      });
    });
  }



  // formSubmit
  static formSubmitAction(arr, path) {
    const title = document.querySelector("#book-title");
    const author = document.querySelector("#author-name");
    const cover = document.querySelector("#book-cover");
    const description = document.querySelector("#book-descrip");
    const form = document.querySelector("form");
    let status = "";

    // Check path
    switch (path) {
      case "/to-read.html":
        status = "bookmarked";
        break;
      case "/read.html":
        status = "read";
        break;
      case "/reading.html":
        status = "reading";
        break;
      default:
      // code here
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    const submitBtn =  document.querySelector('#submit-btn');
       
    submitBtn.addEventListener("click", () => {
      let book = new Book();
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        book.title = title.value;
        book.author = author.value;
        book.cover = reader.result;
        book.summary = description.value;
        book.id = arr.length + 1;
        book.status = status;
        localStorage.setItem(book.title, JSON.stringify(book));
      });

      reader.readAsDataURL(cover.files[0]);
      window.location.href = window.location.origin + path;
    });
  }

  // load from local storage
  static loadFromStorage() {
    const books = [];
    const keys = Object.entries(localStorage);
    keys.forEach((key) => {
      if (key[0] !== "activebook") {
        let book = localStorage.getItem(key[0]);
        try {
          book = JSON.parse(book);
        } catch {}

        if (book.title && book.author) {
          books.push(book);
        }
      }
    });
    return books;
  }
}
