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
  }

  loadBooks(){}
}

// application model
class Model {
  constructor() {}

  addToArrays(){}
  
}

// application view
class View {
  constructor() {}

  checkViewWidth() {}

  addToDashboard() {}

  display(){}
  
}

// start application
(() => {
  const app = App.getInstance();
})();
