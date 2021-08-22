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


  static buildStats(num, msg){
    const HTML = `
    <div class="col-sm-6 col-md-6 col-xl-3 mb-3">
      <div class="card rounded border text-cent py-5">
        <div class = "card-body">
          <h2 class ="card-title text-primary">${num}</h2>
          <h6 class = "card-subtitle mb-2 m-1 text-secondary">${msg}</h6>
        </div>
      </div>
    </div>`

    return HTML;
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
