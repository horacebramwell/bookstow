class Utils {
  constructor() {}

  // get current page
  static getCurrentPage() {
    const href = window.location.href;
    const links = document.querySelectorAll(".nav-link");

    links.forEach((link) => {
      if (href === link.href) {
        link.classList.add("current-page");
      }
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
        }catch {}

        if (book.title && book.author) {
          books.push(book);
        }
      }
    });
    return books;
  }
}
